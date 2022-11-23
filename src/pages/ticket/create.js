import React from "react"; 
import {Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import TicketTopBar from "./createTicket/topbar";
import HTTPManager from "../../utils/httpRequestManager";
import ServiceSideMenu from "./createTicket/serviceSideMenu";
import './createTicket/css/common.css';
import './createTicket/css/topbar.css';
import SelectedServicesComponent from './createTicket/selectedServices';
import TicketTotalComponent from './createTicket/ticketTotal';
import TicketFooterComponent from "./createTicket/footer";

export default class CreateTicketComponent extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            userdetail:{}, 
            isLoading: false, 
            ticketDetail:{},
            showError: false,
            error: false,
            selectedTech: {},
            customer_detail:{},
            selectedServices:[],
            selectedRow:-1,
            selectedMenu: 1,
            defaultTaxes:[],
            isDisabled: false, 
            totalValues:{
                retailPrice:0,
                servicePrice:0,
                ticketSubTotal:0,
                ticketDiscount:0,
                taxAmount:0,
                tipsAmount:0,
                grandTotal:0
            },
            tips_input:{},
            ticketdiscounts:[],

        }  
        this.setTicketOwner = this.setTicketOwner.bind(this)
        this.onSelectService  = this.onSelectService.bind(this);
        this.calculateTaxForService = this.calculateTaxForService.bind(this);
        this.calculateDiscountForService = this.calculateDiscountForService.bind(this);
        this.onSelectRowService = this.onSelectRowService.bind(this);
        this.onSelectSideMenu = this.onSelectSideMenu.bind(this);
        this.calculateAllServices = this.calculateAllServices.bind(this);
        this.onChangeTechnician = this.onChangeTechnician.bind(this);
        this.onUpdateQuantity = this.onUpdateQuantity.bind(this);
        this.onVoidItem = this.onVoidItem.bind(this)
        this.onUpdatePrice = this.onUpdatePrice.bind(this)
        this.makeSpecialRequest = this.makeSpecialRequest.bind(this)
        this.removeSpecialRequest = this.removeSpecialRequest.bind(this)
        this.onUpdateRequestNotes = this.onUpdateRequestNotes.bind(this)
        this.selectDiscount = this.selectDiscount.bind(this)
        this.selectTax = this.selectTax.bind(this);
        this.onSaveSplit = this.onSaveSplit.bind(this)
        this.voidTicket = this.voidTicket.bind(this);
        this.onUpdateNotes = this.onUpdateNotes.bind(this);
        this.handleCloseTips = this.handleCloseTips.bind(this);
        this.saveTicket = this.saveTicket.bind(this);
        this.updateTicketDiscount = this.updateTicketDiscount.bind(this);
    } 

    updateTicketDiscount(discounts, totalDiscountAmount){
        var price = Object.assign({}, this.state.totalValues);
        price.ticketDiscount = totalDiscountAmount; 
        console.log( Number(price.ticketSubTotal) ,"+", Number(price.taxAmount) ,"+", Number(price.tipsAmount)  ,"-", Number(totalDiscountAmount))
        price.grandTotal = Number(price.ticketSubTotal) + Number(price.taxAmount) + Number(price.tipsAmount) - Number(totalDiscountAmount)
        this.setState({totalValues: price,ticketdiscounts: discounts})
    }

    saveTicket(option){
        console.log("AAAA")
        this.httpManager.postRequest('merchant/ticket/saveTicket',{ticketDetail:Object.assign({}, this.state.ticketDetail), selectedServices: Object.assign([], this.state.selectedServices)}).then(resp=>{
            console.log(resp)
        })
    }
    
    handleCloseTips(msg, tipsInput){
        console.log(tipsInput)
        if(tipsInput !== undefined){
            this.setState({selectedServices: tipsInput.selectedServices}, ()=>{
                var tipinputobj = Object.assign(tipsInput);
                delete tipinputobj.selectedServices
                this.setState({ tips_input: tipinputobj})
                this.calculateAllServices(0);
            })
        }
        // "tipsType": ticketDetail.tipsType,
    }

    onUpdateNotes(e){
        var ticket = Object.assign({}, this.state.ticketDetail);
        ticket.ticketNotes = e.target.value;
        this.setState({ticketDetail: ticket});
    }

    onSaveSplit(splittedservices){
        var services= Object.assign([], this.state.selectedServices);
        services.splice(this.state.selectedRow, 1);
        splittedservices.forEach(elmt=>{
            services.push(elmt)
        })
        this.setState({selectedServices: services, selectedRow:-1, selectedMenu:-1},()=>{
            this.calculateAllServices(0);
        })
    }

    selectTax(tax){ 
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);

        var servicetaxes = this.state.selectedServices[this.state.selectedRow].ticketservicetaxes.map(t=>t.mTaxId.toString());
        if(servicetaxes.indexOf(tax.mTaxId) === -1){
            service.ticketservicetaxes.push(tax);
        }
        else{
            var idx = servicetaxes.indexOf(tax.mTaxId);
            service.ticketservicetaxes.splice(idx,1)
        }
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services},()=>{
            this.calculateAllServices(0);
        });
    }

    selectDiscount(dis){ 
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        var servicetaxes = this.state.selectedServices[this.state.selectedRow].ticketservicediscounts.map(t=>t.mDiscountId);
        if(servicetaxes.indexOf(dis.mDiscountId) === -1){
            service.ticketservicediscounts.push(dis);
        }
        else{
            var idx = servicetaxes.indexOf(dis.mDiscountId);
            service.ticketservicediscounts.splice(idx,1)
        }
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services},()=>{
            this.calculateAllServices(0);
        });
    }

    onUpdateRequestNotes(val){
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        service.serviceNotes = val;
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services});
    }

    makeSpecialRequest(){ 
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        service.isSpecialRequest = 1;
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services});
    }
    removeSpecialRequest(){ 
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        service.isSpecialRequest = 0;
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services, selectedMenu:1});
    }


    onVoidItem(){
        var services = Object.assign([], this.state.selectedServices);
        services.splice(this.state.selectedRow,1)
        this.setState({selectedServices: services, selectedMenu: -1, selectedRow:-1})
    }

    onChangeTechnician(tech){
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        service.technician = tech;
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services});
    }

    onUpdateQuantity(qty){
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        service.qty = qty;
        service.subTotal = Number(qty)*Number(service.perunit_cost)
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services},()=>{
            this.calculateAllServices(0);
        });
    }

    onUpdatePrice(price){
        var service = Object.assign({}, this.state.selectedServices[this.state.selectedRow]);
        service.perunit_cost = price;
        service.subTotal = Number(service.qty)*Number(service.perunit_cost)
        var services = Object.assign([], this.state.selectedServices);
        services[this.state.selectedRow]= service;
        this.setState({selectedServices: services},()=>{
            this.calculateAllServices(0);
        });
    }

    calculateAllServices(i){
        if(i< this.state.selectedServices.length){
            var obj = Object.assign({}, this.state.selectedServices[i]); 
            this.calculateDiscountForService(obj, 0 , i)
        }
        else{  
            this.calculateTicketTotal({
                retailPrice:0,
                servicePrice:0,
                ticketSubTotal:0,
                ticketDiscount:this.state.ticketdiscounts.length ? this.state.totalValues.ticketDiscount :  0,
                taxAmount:0,
                tipsAmount:0,
                grandTotal:0
            }); 
        }
    }

    onSelectSideMenu(mindex){
        if(mindex > 0)
            this.setState({selectedMenu: mindex})
        else
            this.setState({selectedMenu:-1, selectedRow: -1})
    }

    onSelectRowService(rowIndex){
        this.setState({selectedRow: rowIndex})
    }

    onSelectService(service){
        var obj = {
            serviceDetail: service,
            qty: 1,
            perunit_cost: Number(service.mProductPrice),
            originalPrice:  Number(service.mProductPrice),
            subTotal: Number(service.mProductPrice),
            ticketservicetaxes:[],
            ticketservicediscounts:[],
            totalTax:0,
            totalDiscount:0,
            totalTips:0,
            isSpecialRequest: 0,
            serviceNotes:'',
            technician: this.state.selectedTech
        }
        if(service.mProductTaxType === "Default"){
            obj.ticketservicetaxes = Object.assign([], this.state.defaultTaxes)
        }
        else{
            obj.ticketservicetaxes = Object.assign([], service.mProductTaxes)
        }
        this.calculateDiscountForService(obj)
    }

    calculateTaxForService(obj, i=0, idx=-1){
        if(i < obj.ticketservicetaxes.length){
            if(i===0){
                obj.totalTax = 0
            }
            var taxdetail = obj.ticketservicetaxes[i];
            if(taxdetail.mTaxType === 'Percentage'){ 
                taxdetail["mTaxAmount"] = Number((taxdetail.mTaxValue/100)*obj.subTotal).toFixed(2);
                console.log(taxdetail["mTaxAmount"])
            }
            else{
                taxdetail["mTaxAmount"] = Number(taxdetail.mTaxValue).toFixed(2);
            }
            obj.ticketservicetaxes[i] = taxdetail;
            obj.totalTax = Number(obj.totalTax)+Number(taxdetail["mTaxAmount"]);
            this.calculateTaxForService(obj, i+1, idx);

        }
        else{ 
            if(idx > -1){
                var selectedservices = Object.assign([], this.state.selectedServices); 
                selectedservices[idx] = obj
                this.setState({selectedServices: selectedservices}, ()=>{
                    this.calculateAllServices(idx+1)
                })
            }
            else{
                console.log("IDX", idx)
                var selectedservices1 = Object.assign([], this.state.selectedServices); 
                selectedservices1.push(obj);
                this.setState({selectedServices: selectedservices1}, ()=>{ 
                    this.calculateTicketTotal({
                        retailPrice:0,
                        servicePrice:0,
                        ticketSubTotal:0,
                        ticketDiscount:this.state.ticketdiscounts.length ? this.state.totalValues.ticketDiscount :  0,
                        taxAmount:0,
                        tipsAmount:0,
                        grandTotal:0
                    });
                })
            }
        }
    }


    calculateDiscountForService(obj, i=0, idx=-1){
        var ticketDetail = Object.assign({}, this.state.ticketDetail);
        if(i < obj.ticketservicediscounts.length){ 
            if(i===0){
                obj.subTotal = Number(obj.qty) * Number(obj.perunit_cost)
                obj.totalDiscount = 0
            }
            var discountdetail = obj.ticketservicediscounts[i];
            console.log(discountdetail)
            if(discountdetail.mDiscountType === 'Percentage'){
                discountdetail["mDiscountAmount"] = Number((discountdetail.mDiscountValue/100)*obj.subTotal).toFixed(2);
            }
            else{
                discountdetail["mDiscountAmount"] = Number(discountdetail.mDiscountValue).toFixed(2);
            }
            obj.ticketservicediscounts[i] = discountdetail;
            obj.totalDiscount = Number(obj.totalDiscount)+Number(discountdetail["mDiscountAmount"]);
            obj.subTotal= Number(obj.subTotal)-Number(obj.totalDiscount)
            ticketDetail.serviceDiscountApplied = 1
            this.setState({ticketDetail: ticketDetail});
            this.calculateDiscountForService(obj, i+1, idx);
        }
        else if( obj.ticketservicediscounts.length === 0){
            obj.subTotal = Number(obj.qty) * Number(obj.perunit_cost)
            ticketDetail.serviceDiscountApplied = 0
            this.setState({ticketDetail: ticketDetail});
            this.calculateTaxForService(obj,i, idx);
        }
        else{
            // obj.subTotal = Number(obj.qty) * Number(obj.perunit_cost)
            this.calculateTaxForService(obj,i, idx);
        }
    }


    calculateTicketTotal(price, i=0){
        if(i < this.state.selectedServices.length){
            var service =  Object.assign({}, this.state.selectedServices[i])
            if(service.serviceDetail.mProductType==='Product'){
                price.retailPrice = Number(price.retailPrice)+(Number(service.qty)* Number(service.perunit_cost))
            }
            else{
                price.servicePrice = Number(price.servicePrice)+(Number(service.qty)* Number(service.perunit_cost))
            }
            price.ticketSubTotal =  Number(price.ticketSubTotal)+(Number(service.subTotal))
            // price.ticketDiscount = Number(price.ticketDiscount)+Number(service.totalDiscount)
            price.taxAmount = Number(price.taxAmount)+Number(service.totalTax)
            price.tipsAmount = Number(price.tipsAmount)+Number(service.totalTips)
            this.calculateTicketTotal(price, i+1);
        }
        else{
            console.log(price.ticketSubTotal, "-",  price.ticketDiscount, "+", price.taxAmount, "+", price.tipsAmount)
            
            price.grandTotal = price.ticketSubTotal -  price.ticketDiscount + price.taxAmount + price.tipsAmount
            var ticketDetail = Object.assign({}, this.state.ticketDetail)
            var ticketinput = {  
                "ticketId": this.state.ticketDetail.ticketId,
                "ownerTechnician" : this.state.selectedTech.mEmployeeId,
                "technician" : this.state.selectedTech,
                "customerId" : this.state.customer_detail.mCustomerId,
                "taxApplied": Number(price.taxAmount) > 0 ? 1 : 0, 
                "ticketDiscountApplied"	: Number(price.ticketDiscount) > 0 ? 1 : 0,
                "serviceDiscountApplied": this.state.ticketDetail.serviceDiscountApplied, 
                "tipsAmount":  price.tipsAmount,
                "taxAmount"	: price.taxAmount,
                "serviceAmount"	: price.ticketSubTotal,
                "ticketTotalAmount"	: price.grandTotal,
                "ticketNotes": ticketDetail.ticketNotes, 
                "paymentStatus":"Pending",
                "isDraft":0, 
            }

            this.setState({totalValues: price, ticketDetail: ticketinput},()=>{
                if(this.state.ticketdiscounts.length > 0){
                    this.updateTicketDiscountAmount();
                }
            })
        }
    }

    updateTicketDiscountAmount(i=0){
        if(i < this.state.ticketdiscounts.length){
            var discounts = Object.assign([], this.state.ticketdiscounts); 
            var discount = discounts[i]
            var discountobj = Object.assign({}, discount );
            discountobj.mDiscountAmount = 0
            if(discount.mDiscountType === 'Percentage'){
                discountobj.mDiscountAmount  = (Number(discount.mDiscountValue)/100) * Number(this.state.totalValues.ticketSubTotal)
            }
            else{
                discountobj.mDiscountAmount  = discount.mDiscountValue
            }
            discounts[i] = discountobj;
            this.setState({ticketdiscounts: discounts})
            this.updateTicketDiscountAmount(i+1)
        } 
        else{ 
            var totalDiscountAmount = 0;
            this.state.ticketdiscounts.forEach((dis,i) =>{
                totalDiscountAmount = Number(totalDiscountAmount)+Number(dis.mDiscountAmount)
                if(i=== this.state.ticketdiscounts.length-1){
                    var price = Object.assign({}, this.state.totalValues);
                    price.ticketDiscount = totalDiscountAmount; 
                    console.log( Number(price.ticketSubTotal) ,"+", Number(price.taxAmount) ,"+", Number(price.tipsAmount)  ,"-", Number(totalDiscountAmount))
                    price.grandTotal = Number(price.ticketSubTotal) + Number(price.taxAmount) + Number(price.tipsAmount) - Number(totalDiscountAmount)
                    this.setState({totalValues: price})
                }
            })
        }
    }

    setTicketOwner(detail){
        this.setState({selectedTech: detail})
    }

    componentDidMount(){
        if(this.props.data.ticketDetail !== undefined){

        }
        else{
            this.httpManager.postRequest("merchant/ticket/getTicketcode",{data:"REQUEST TICKET CODE"}).then(res=>{
                this.setState({ticketDetail: res.data})
                // console.log(res.data)
            }).catch(e=>{
                this.setState({error: e.message}, ()=>{
                    this.setState({showError: true})
                })
            })
        }

        if(this.props.data.ownerTechnician !== undefined){
            this.setState({selectedTech: this.props.data.ownerTechnician, customer_detail: this.props.data.customer_detail}, ()=>{
                
            })
        }

        this.httpManager.postRequest('merchant/tax/getByType/default', {data:"TICKET"}).then(res=>{
            this.setState({defaultTaxes: res.data})
        })
    }

    voidTicket(){
        this.httpManager.postRequest("merchant/ticket/void",{data: this.state.ticketDetail.ticketId}).then(r=>{
            this.props.data.closeCreateTicket()
        })
    }

    render(){
        return  <Grid container className='fullWidth fullHeight' style={{background:'#fff', borderTop:'1px solid #f0f0f0'}}>
                    <Grid item xs={12}  className='fullWidth fullHeight'>
                            <Grid item xs={12} style={{height:'100px', background:'red'}} className='fullWidth'>
                               {this.state.selectedTech.mEmployeeId !== undefined && <TicketTopBar data={{
                                    selectedTech:this.state.selectedTech,
                                    customer_detail:this.state.customer_detail,
                                    ticketDetail: this.state.ticketDetail,
                                    setTicketOwner: this.setTicketOwner,
                                    isDisabled: false,
                                    handleCloseTicket: ()=>{
                                        this.props.data.closeCreateTicket()
                                    }
                                }}/>}
                            </Grid>
                            <Grid item xs={12} style={{height:'calc(100% - 100px)', display:'flex', borderTop:'1px solid #dfdfdf' }} className='fullWidth'>
                                <Grid item xs={7} className='fullHeight'>
                                    <Grid item xs={12} style={{height:'calc(100% - 263px)' }} className='fullWidth'>
                                        <SelectedServicesComponent data={{
                                            onSelectRowService: this.onSelectRowService,
                                            selectedServices: this.state.selectedServices,
                                            selectedRow: this.state.selectedRow,
                                            isDisabled: this.state.isDisabled
                                        }} />
                                    </Grid>
                                    <Grid item xs={12} style={{height:'163px', borderTop:'1px solid #d0d0d0' }} className='fullWidth'>
                                        <TicketTotalComponent data={{price: this.state.totalValues}} />
                                    </Grid>

                                    <Grid item xs={12} style={{height:'100px' }} className='fullWidth'>
                                    <TicketFooterComponent data={{
                                                                            tipsAdjust: this.state.tipsAdjust,
                                                                            isDisabled: this.state.isPaidOnOpen,
                                                                            isTicketEdit: this.props.isTicketEdit,
                                                                            selectedServices: this.state.selectedServices,
                                                                            selectedTech: this.state.selectedTech,
                                                                            ticketDetail: this.state.ticketDetail, 
                                                                            customer_detail: this.state.customer_detail,
                                                                            ticketdiscounts: this.state.ticketdiscounts,
                                                                            saveTicket: this.saveTicket,
                                                                            reloadTicket: this.reloadTicket,
                                                                            price: this.state.totalValues,
                                                                            onUpdateNotes:this.onUpdateNotes,
                                                                            printTicket: (option)=>{
                                                                                this.setState({printtype:option},()=>{
                                                                                    this.printTicket();
                                                                                });
                                                                            },
                                                                            showCloseTicketPrint:()=>{
                                                                                this.setState({closedticketprint: true})
                                                                            },
                                                                            setLoader:(boolval)=>{
                                                                                this.setState({isLoading: boolval})
                                                                            },
                                                                            price: this.state.totalValues,
                                                                            voidTicket:()=>{
                                                                                this.voidTicket()
                                                                            },
                                                                            saveNotes:(notes)=>{
                                                                                this.saveNotes(notes);
                                                                            },
                                                                            handleCloseTips:(msg, tipsInput)=>{
                                                                                this.handleCloseTips(msg, tipsInput);
                                                                            }, 
                                                                            updateTicketDiscount: this.updateTicketDiscount
                                                                        }} />
                                    </Grid>
                                </Grid>
                                <Grid item xs={5} style={{height:'100%', overflow:'hidden', borderLeft:'1px solid #dfdfdf'}} className='fullHeight'>
                                        <ServiceSideMenu data={{
                                            selectedRow:this.state.selectedRow,
                                            selectedServices: this.state.selectedServices, 
                                            selectedMenu: this.state.selectedMenu,
                                            onSelectSideMenu: this.onSelectSideMenu,
                                            onSelectService: this.onSelectService,
                                            onChangeTechnician: this.onChangeTechnician,
                                            onUpdateQuantity: this.onUpdateQuantity,
                                            onVoidItem: this.onVoidItem,
                                            onUpdatePrice: this.onUpdatePrice,
                                            makeSpecialRequest: this.makeSpecialRequest,
                                            removeSpecialRequest: this.removeSpecialRequest,
                                            onUpdateRequestNotes: this.onUpdateRequestNotes,
                                            selectDiscount: this.selectDiscount,
                                            selectTax: this.selectTax,
                                            onSaveSplit: this.onSaveSplit

                                        }} />
                                </Grid>
                            </Grid>
                    </Grid>


                <Dialog
                    open={this.state.showError}
                    onClose={()=>
                        this.setState({error: ""}, ()=>{
                            this.setState({showError: false})
                        })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.error}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>{
                           this.setState({showError: false, error:''})
                        }}>OK </Button> 
                    </DialogActions>
                </Dialog>
            </Grid> 
    }
}
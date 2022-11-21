import React from "react"; 
import {Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import TicketTopBar from "./createTicket/topbar";
import HTTPManager from "../../utils/httpRequestManager";
import ServiceSideMenu from "./createTicket/serviceSideMenu";
import './createTicket/css/common.css';
import './createTicket/css/topbar.css';

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
            defaultTaxes:[]
        }  
        this.setTicketOwner = this.setTicketOwner.bind(this)
        this.onSelectService  = this.onSelectService.bind(this);
        this.calculateTaxForService = this.calculateTaxForService.bind(this);
        this.calculateDiscountForService = this.calculateDiscountForService.bind(this);
    } 

    onSelectService(service){
        var obj = {
            serviceDetail: service,
            qty: 1,
            originalPrice:  Number(service.mProductPrice),
            subTotal: Number(service.mProductPrice),
            ticketservicetaxes:[],
            ticketservicediscounts:[],
            totalTax:0,
            totalDiscount:0
        }
        if(service.mProductTaxType === "Default"){
            obj.ticketservicetaxes = Object.assign([], this.state.defaultTaxes)
        }
        else{
            obj.ticketservicetaxes = Object.assign([], service.mProductTaxes)
        }
        this.calculateTaxForService(obj);
    }

    calculateTaxForService(obj, i=0){
        if(i < obj.ticketservicetaxes.length){
            var taxdetail = obj.ticketservicetaxes[i];
            if(taxdetail.mTaxType === 'Percentage'){
                taxdetail["mTaxAmount"] = (taxdetail.mTaxValue/100)*obj.subTotal;
            }
            else{
                taxdetail["mTaxAmount"] = taxdetail.mTaxValue;
            }
            obj.ticketservicetaxes[i] = taxdetail;
            obj.totalTax = obj.totalTax+taxdetail["mTaxAmount"];
            this.calculateTaxForService(obj, i+1);

        }
        else{
            this.calculateDiscountForService(obj)
        }
    }


    calculateDiscountForService(obj, i=0){
        if(i < obj.ticketservicediscounts.length){ 
            var discountdetail = obj.ticketservicediscounts[i];
            if(discountdetail.mDiscountType === 'Percentage'){
                discountdetail["mDiscountAmount"] = (discountdetail.mDiscountValue/100)*obj.subTotal;
            }
            else{
                discountdetail["mDiscountAmount"] = discountdetail.mDiscountValue;
            }
            obj.ticketservicetaxes[i] = discountdetail;
            obj.totalDiscount = obj.totalDiscount+discountdetail["mDiscountAmount"];
            this.calculateDiscountForService(obj, i+1);
        }
        else{
            var selectedservices = Object.assign([], this.state.selectedServices);
            selectedservices.push(obj);
            this.setState({selectedServices: selectedservices}, ()=>{
                console.log(this.state.selectedServices)
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
                                    <Grid item xs={12} style={{height:'calc(100% - 300px)' }} className='fullWidth'>

                                    </Grid>
                                    <Grid item xs={12} style={{height:'200px', background:'gray'}} className='fullWidth'>

                                    </Grid>

                                    <Grid item xs={12} style={{height:'100px', background:'green'}} className='fullWidth'>

                                    </Grid>
                                </Grid>
                                <Grid item xs={5} style={{height:'100%', overflow:'hidden', borderLeft:'1px solid #dfdfdf'}} className='fullHeight'>
                                        <ServiceSideMenu data={{
                                            selectedRow:this.state.selectedRow,
                                            selectedServices: this.state.selectedServices, 
                                            onSelectService: this.onSelectService
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
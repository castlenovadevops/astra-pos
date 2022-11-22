import React from 'react';
import Moment from 'moment';
import { Grid, Typography, Button,Box, FormControl,FormLabel,FormControlLabel,Radio,RadioGroup} from '@material-ui/core/'; 
import CloseIcon from '@mui/icons-material/Close'; 
import LoadingModal from '../../../..//components/Modal/loadingmodal';
import TextareaAutosizeContent from '../../../../components/formComponents/TextAreaAutosize';
import DataManager from '../../../../controller/datacontroller';
import TicketManager from '../../../../controller/TicketManager';
import TicketController from '../../../../controller/TicketController';
import { QueryFunctions } from '../ticketcommon/functions';
import TicketDataController from '../../../../controller/TicketDataController';
const paymentStyle = {
    position: 'absolute',
    top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '0',
    boxShadow: 24,
    p: 4,
};

class TicketPayment extends React.Component  {
    queryManager = new QueryFunctions();
    ticketcontroller = new TicketController();
    ticketdatacontroller = new TicketDataController();
    constructor(props) {
        super(props);
        this.state={
            ticketDetail : {},
            isCard_type_show:false,
            card_type:'debit',
            description:'',
            employeedetail:{},
            payment_type:'cash',
            isLoading: false,
            services_taken:[],
            dataManager: new DataManager(),
            businessdetail:{}
        }
        this.checkPaymentType = this.checkPaymentType.bind(this)
        this.handlechangeDesc = this.handlechangeDesc.bind(this)
        this.savePayment = this.savePayment.bind(this)
    }
    componentDidMount(){
        //console.log(this.props.ticketDetail)
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            var businessdetail = JSON.parse(detail);
            this.setState({businessdetail:businessdetail}, function(){

                if(this.props.ticketDetail !== undefined){
                    this.setState({ticketDetail : this.props.ticketDetail}, function(){
                        this.getServiceDetails();
                    })
                }
                var employeedetail = window.localStorage.getItem('employeedetail');
                if(employeedetail !== undefined){
                    this.setState({employeedetail:JSON.parse(employeedetail)})
                }
            });
        }
    }

    getServiceDetails(){
        var ticket_id = this.state.ticketDetail.id;
        this.setState({isLoading: true})
        const sql = "select ts.*,s.*,ts.id as uniquId, rn.id as notesid, rn.notes as requestNotes, d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.Id left join ticketservice_requestnotes as rn on rn.ticket_id=ts.ticket_id and rn.service_id=ts.service_id and rn.isActive=1 left join discounts as d on d.id = ts.discount_id where ts.ticket_id =  '"+ticket_id+"'  and ts.isActive=1" 
         this.state.dataManager.getData(sql).then(response =>{
       
            if (response instanceof Array) { 
                this.setState({ticketSelectedServices: response})
                for (var i=0;i < response.length; i++){ 
                    this.addServices(response[i])  
                    if(i === response.length-1){
                    }
                }
            }
        })  
        this.setState({isLoading: false})
    } 
    

    addServices = (servicein) => new Promise((resolve, reject) => {   
        var obj = {
            "servicedetail": servicein,
            discount:{},
            taxes:[],
            subtotal:this.state.isEdit ? servicein.service_cost : servicein.price,
            taxamount:0,
            discountamount:this.state.isEdit ?  servicein.total_discount_amount :0,
            qty:1,
            perunit_cost:servicein.price,
            employee_id:this.state.isEdit ? servicein.employee_id : this.state.technician_id,
            isSpecialRequest: 0,
            process:''
        }
        var sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.id=st.tax_id and t.status='active' where st.service_id='"+servicein.id+"' and st.status='active'";

            obj["discount"].discount_id = servicein.discount_id
            obj["discount"].discount_type = servicein.discount_type
            obj["discount"].discount_value = servicein.discount_value
            obj["discount"].discount_name = servicein.discount_name
            obj["discount"].total_discount_amount = servicein.total_discount_amount

            sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from ticketservice_taxes as st join taxes as t on t.id=st.tax_id and t.status='active' where st.ticketservice_id='"+servicein.uniquId+"' and st.isActive=1"
       
        this.state.dataManager.getData(sql).then(response =>{  
            obj.taxes = response; 
            var services = this.state.services_taken;
            services.push(obj);
            this.setState({services_taken: services})
        });
    }) 

    printTicket() {
        var print_data = this.processPrintDetails()
        //console.log("service_data", service_data)
            var printerName = window.localStorage.getItem('defaultprinter')
            if(printerName != undefined && printerName != ''){
                this.setState({print_data: print_data}, function() {
                    // this.setState({printpopup: true}) 
                    var total=Number(this.state.ticketDetail.grand_total).toFixed(2)
                    var ticketid = this.state.ticketDetail.ticket_code;
                    console.log(printerName);
                    var data = [];
                    data.push({
                        type: "text", 
                        value: this.state.businessdetail.name,//"TOP PAYMENT SOLUTIONS - Main",
                        style: `text-align:center;`,
                        css: {  "font-weight": "700", "font-size": "16px" },
                        }); 
                    
                    data.push({
                        type: "text", 
                        value: this.state.businessdetail.address1+"<br/>"+ this.state.businessdetail.address2+"<br/>"+this.state.businessdetail.city+"<br/>" +this.state.businessdetail.state+ this.state.businessdetail.zipcode+"<br/>"+ this.state.businessdetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
                        style: `text-align:center;`,
                        css: { "font-size": "12px","margin-top": 2 },
                        }); 
                    data.push({
                        type: "text", 
                        value: "",//"http://toppaymentsolutions.com",
                        style: `text-align:center;`,
                        css: { "font-size": "10px","margin-top": 2 },
                        }); 
    

                    data.push({
                        type: "text", 
                        value: "ORDER: "+JSON.parse(window.localStorage.getItem('businessdetail')).name+" - Ticket "+ ticketid,
                        style: `text-align:center;`,
                        css: { "font-weight": "700", "font-size": "18px","margin-top": 10 },
                        }); 
                    data.push({
                        type: "text", 
                        value: "Cashier: "+JSON.parse(window.localStorage.getItem('employeedetail')).firstName,
                        style: `text-align:left;`,
                        css: {  "font-size": "12px","margin-top": 5 },
                        });
                    data.push({
                        type: "text", 
                        value:  Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                        style: `text-align:left;`,
                        css: {  "font-size": "12px","margin-top": 5 },
                        });
                    
                    data.push({
                        type: 'table',
                        // style: 'border: 0px solid #ddd',
                        css: {"margin-left": 10,"margin-top": 10,"margin-bottom": 10},
                    
                        tableBody: print_data.map((ser,index)=>{
                        
                            return [
                                {
                                    type: "text", 
                                    value: ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"]+"<br>"+
                                    ((ser["tax"] === "") ? "":ser["tax"]) +"\n<br>"+
                                    ((ser["discount"] === "") ? "":ser["discount"]),
                                    style: `text-align:left;`,
                                    css: {  "font-size": "12px" },
                                },
                                {
                                    type: "text", 
                                    value: "$"+ser["price"],
                                    style: `text-align:left;`,
                                    css: {  "font-weight": "500","font-size": "14px" },
                                },
                                {
                                    type: "text", 
                                    value:  "$"+ser["total"],
                                    style: `text-align:left;`,
                                    css: {  "font-weight": "500","font-size": "14px" },
                                },
                            ]

                        }),
                    
                        tableBodyStyle: 'border: 0.0px solid #ddd',
                        tableSeperatorStyle: 'border: 0.0px solid #ddd'
                    
                    })
                    data.push({
                        type: "text", 
                        value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
                        style: `text-align:left;`,
                        css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                    }); 
                        data.push({
                            type: "text", 
                            value: "<div style='display: flex; justify-content: space-between;'><p >CASH SALE</p> <p>$"+total+"</p> </div>",
                            style: `text-align:left;`,
                            css: {  "font-size": "14px","margin-top": -25 },
                        });

                        data.push({
                            type: "text", 
                            value:  "<div style='display: flex; justify-content: space-between;'><p >Cash tendered</p> <p>$"+total+"</p> </div>",
                            style: `text-align:left;`,
                            css: { "font-size": "14px","margin-top": -25 },
                        }); 

                    data.push({
                        type: "text", 
                        value:  "Enjoy!",
                        style: `text-align:left;`,
                        css: { "font-size": "14px","margin-top": 0 },
                    });

                    window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                        console.log(res);

                        this.props.afterSubmit("Paid Successfully!")
                    })


                })
            }
            else{
            alert("No printer selected");

            this.props.afterSubmit("Paid Successfully!")
            }


    }

    processPrintDetails() { 
        var service_data = []
        
        this.state.services_taken.forEach(( ser,index) => {
            var tax_detail = ""
            var discount_detail = ""
            var tax_data = []
            var discount_data=[]
            console.log(ser.taxes);
            ser.taxes.forEach( (tax) => {
                tax_data.push({ 
                    "tax_name": tax.tax_name+"("+(tax.tax_type === 'percentage' ? '%' : '$')+tax.tax_value+")",
                    "tax_percentage": tax.tax_calculated
                })
            })

            tax_data.forEach((tax) => {
                tax_detail = (tax_detail.length>0 ? tax_detail+"<br>" : tax_detail)+tax["tax_name"]+" - $"+tax["tax_percentage"]
            })

            

            if( ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 ) {
                discount_data.push({ 
                    "discount_name": ser.discount.discount_name+"("+(ser.discount.discount_type === 'percentage'? ser.discount.discount_value+'%' : '$'+ser.discount.discount_value)+")",
                    "discount_price":ser.discount.discount_price ,
                    "price_with_discount":ser.discount.price_with_discount
                })
            }

            discount_data.forEach   ((tax) => {
                discount_detail = (discount_detail.length>0 ? discount_detail+"<br>" : discount_detail)+tax["discount_name"]+" - $"+tax["discount_price"]+""
            }) 
            service_data.push({
                "name" : ser.servicedetail.name,
                "price":  ser.perunit_cost,
                "total": ser.subtotal,
                "tax": tax_detail,
                "discount":discount_detail,
                "quantity": ser.qty
            })
        

        })

    return service_data

        
    }
 

    handleClosePayment(){
        this.props.afterSubmit('');
    }
    handlechangeDesc(e){
        this.setState({description: e.target.value})
    }
    checkPaymentType(type){
        if(type === 'cash'){
            this.setState({isCard_type_show:false,payment_type: type})
        }else{
            this.setState({isCard_type_show:true,payment_type: type})
        }
    }
    handleradio(e){
        this.setState({card_type: e.target.value})
    }
    savePayment(detail,mode, isprint=false){
        console.log(this.props)
        var ticketDetail = this.props.ticketDetail
        //console.log("ttt",ticketDetail);
        this.setState({isLoading: true})
        if(isprint){
            this.getServiceDetails()
        }
        if(ticketDetail.ticketref_id === '' || ticketDetail.ticketref_id === undefined){
            this.queryManager.getTicketByTicketCode(ticketDetail.ticket_code).then(res=>{
                 
                
                window.api.getSyncUniqueId().then(psync=>{
                    var syncid = psync.syncid;
                    var payment_input = {
                        ticket_id : res.length > 0 ? res[0].sync_id : '',
                        pay_mode : mode,
                        payment_status : 'Sucess',
                        paid_at : Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        notes :  this.state.description,
                        card_type : this.state.card_type,
                        ticket_amt: ticketDetail.grand_total,
                        created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        created_by: this.state.employeedetail.id,
                        updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        updated_by: this.state.employeedetail.id,
                        sync_id: syncid,
                        sync_status:0,
                        ticketref_id: res.length > 0 ? res[0].sync_id : '',
                        isActive:1
                    }  
                    window.api.invoke("log","saving to ticket payemt"+ JSON.stringify(payment_input));
                    console.log(res, payment_input);
                    this.ticketcontroller.saveData({table_name:'ticket_payment', data:payment_input}).then((resp)=> { 
                        var paidinput = {
                            paid_status: 'paid',
                            sync_status:0,
                            sync_id: res.length > 0 ? res[0].sync_id : '',
                            updated_at:Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by:this.state.employeedetail.id
                        }
                        window.api.invoke("log","saved to ticket payemt"+ JSON.stringify(paidinput));
                        this.ticketdatacontroller.updateTicketData({table_name:'ticket',data: paidinput, query_field:'sync_id', query_value:paidinput["sync_id"]}).then(res=>{
                                this.setState({isLoading: false})
                                if(isprint){
                                    this.printTicket();
                                }
                                else{
                                    this.props.afterSubmit("Paid Successfully!")
                                }
                        }) 

                    })

                }) 
            })
        }
        else{

            window.api.getSyncUniqueId().then(psync=>{
                var syncid = psync.syncid;
                var payment_input = {
                    ticket_id : ticketDetail.ticketref_id,
                    pay_mode : mode,
                    payment_status : 'Sucess',
                    paid_at : Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    notes :  this.state.description,
                    card_type : this.state.card_type,
                    ticket_amt: ticketDetail.grand_total,
                    created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    created_by: this.state.employeedetail.id,
                    updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    updated_by: this.state.employeedetail.id,
                    sync_id: syncid,
                    sync_status:0,
                    ticketref_id: ticketDetail.ticketref_id,
                    isActive:1
                }  
                console.log("ELSE CONDD", payment_input);
                window.api.invoke("log","saving to ticket payemt"+ JSON.stringify(payment_input));
                this.ticketcontroller.saveData({table_name:'ticket_payment', data:payment_input}).then((resp)=> {
                    console.log("saved to ticket payemt", resp)
                    var paidinput = {
                        paid_status: 'paid',
                        sync_status:0,
                        sync_id:ticketDetail.ticketref_id,
                        updated_at:Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        updated_by:this.state.employeedetail.id
                    }
                    window.api.invoke("log","saved to ticket payemt"+ JSON.stringify(paidinput));
                    this.ticketcontroller.updateData({table_name:'ticket',data: paidinput, query_field:'sync_id', query_value:ticketDetail.ticketref_id}).then(res=>{
                            this.setState({isLoading: false})
                            if(isprint){
                                this.printTicket();
                            }
                            else{
                                this.props.afterSubmit("Paid Successfully!")
                            }
                    }) 
    
                })
    
            }) 
        }
    }
    render() {
        return (
            
                
                <Box sx={paymentStyle} style={{borderRadius: 10}}>
                    {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
                    
                    <Grid container spacing={2} >
                        <Grid item xs={12} style={{display:'flex'}}>
                            <Grid item xs={4}>
                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{"color":'#134163'}}>
                                    Ticket Code : {this.state.ticketDetail.ticket_code}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{"color":'#134163'}}>
                                    Pay Full Amount ${this.state.ticketDetail.grand_total}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={() => this.handleClosePayment()}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid>      
                        </Grid>
                        <Grid item xs={12} style={{display:'flex'}}>
                            <Grid item xs={4}>
                                <Grid item xs={12} style={{padding: 10, border:'1px solid #f0f0f0',height:'350px'}}>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Pay For This Order</Typography>

                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Order Subtotal : ${this.state.ticketDetail.subtotal}</Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Tips : ${this.state.ticketDetail.tips_totalamt}</Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Discount : ${this.state.ticketDetail.discount_totalamt}</Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Tax :  ${this.state.ticketDetail.total_tax} </Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Total : ${this.state.ticketDetail.grand_total}</Typography>
                                    {/* <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Amount Remaining</Typography> */}
                                    {/* <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Payment 1</Typography> */}

                                </Grid>
                            </Grid>
                            <Grid item xs={8}> 
                                <Grid item xs={12} style={{padding: 0,paddingLeft: 10,display:'flex' }}> 
                                    <Grid item xs={4}>
                                        <Button onClick={()=>this.checkPaymentType('cash')} color="secondary" fullWidth variant={this.state.isCard_type_show ? "outlined" : "contained"}>Pay By Cash</Button>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={4}>
                                    <Button onClick={()=>this.checkPaymentType('card')} color="secondary" fullWidth variant={this.state.isCard_type_show ? "contained" : "outlined"}>Pay By Card</Button>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    
                                </Grid>
                                { this.state.isCard_type_show &&
                                <Grid item xs={12} style={{padding: 10, visibility: this.state.isCard_type_show ? 'visible' : 'hidden'}}>
                                        <FormControl component="fieldset"> 
                                            <RadioGroup row aria-label="card" name="row-radio-buttons-group">
                                                <FormControlLabel value={this.state.card_type} control={<Radio value="credit" checked={this.state.card_type === 'credit'} onChange={(e)=>{ this.handleradio(e); }}/>} label="Credit Card" />
                                                <FormControlLabel value={this.state.card_type} control={<Radio value="debit" checked={this.state.card_type === 'debit'} onChange={(e)=>{ this.handleradio(e); }}/>} label="Debit Card" />
                                             </RadioGroup>
                                        </FormControl>
                                </Grid>}
                                <Grid item xs={12} className='notefield' style={{padding: 10,display:'flex' }}>
                                        <TextareaAutosizeContent 
                                            fullWidth
                                            label="Notes"
                                            name="Notes"
                                            id="Notes"
                                            rows={3} 
                                            multiline
                                            value={this.state.description}
                                            onChange={this.handlechangeDesc}

                                        />                                                
                                </Grid>
                                <Grid item xs={12} style={{padding: 10,display:'flex',  justifyContent:"flex-end"}}>
                                    <Button  onClick={()=>this.savePayment(this.state.ticketDetail,this.state.payment_type)} color="secondary" variant="contained">Pay</Button>
                                    <Button  onClick={()=>this.savePayment(this.state.ticketDetail,this.state.payment_type, 'print')} color="secondary" style={{marginLeft:'1rem'}} variant="contained">Pay & Print</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
           
        )
    }
}
export default TicketPayment;
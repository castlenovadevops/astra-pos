import React from 'react';
import LoadingModal from '../../../../../components/Loader';
import { Grid, Typography, Button,Box, FormControl,FormLabel,FormControlLabel,Radio,RadioGroup} from '@material-ui/core/';  
import CloseIcon from '@mui/icons-material/Close';  
import TicketFullPayment from './payfull';
import TicketSplitPayment from './splitpay';
import AccountCircle from '@mui/icons-material/AccountCircle';
import './tab.css';
import HTTPManager from '../../../../../utils/httpRequestManager';

import DialogComponent from "../../../../../components/Dialog"; 
import SelectCustomer from "../../topbar/selectCustomer";

const paymentStyle = {
    position: 'absolute',
    top: '0', 
    left:'0',
    width: '100%',
    bgcolor: 'background.paper',
    border: '0',
    boxShadow: 24,
    pt: 2.5,
    pb:2.5,
    pl:1,
    pr:1
};

export default class TicketPayment extends React.Component  {
    httpManager = new HTTPManager();

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            employeedetail:{},
            businessdetail:{},
            ticketDetail:{}, 
            ticketpayments:[],
            remainAmount: 0,
            activeTab:'full',
            paymentSplitted: false,
            splittedAmount: 0,
            selectCustomerPopup: false,
            printerror: false
        }

        this.getTicketPayments = this.getTicketPayments.bind(this);
        this.getPrintHTML = this.getPrintHTML.bind(this);
    }

    
    componentDidMount(){   
        this.loadData()
    } 


    getPrintHTML(billtype){
        this.httpManager.postRequest(`pos/print/getPrintHTML`,{ticketId : this.props.ticketDetail.ticketId}).then(htmlres=>{
            // console.log(JSON.parse(htmlres.htmlMsg))
            // window.api.printHTML({htmlres.htmlMsg, htmlres.printers.printerIdentifier}).then(r=>{
            //     console.log("Printed Successfully.")
            // })
            if(htmlres.htmlMsg instanceof Array){
                htmlres.htmlMsg.forEach(html=>{ 
                    var final_printed_data = '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"></head><body>';
                    final_printed_data += "<div style='max-width:270px'>"+html+"</div>";
                    final_printed_data += '</body></html>';
                    // window.api.printHTML({html:html, printername:htmlres.printers.printerIdentifier}).then(r=>{console.log(htmlres.printers.printerIdentifier)
                    if(htmlres.printers.printerIdentifier !== undefined){
                        window.api.printHTML({html:final_printed_data, printername:htmlres.printers.printerIdentifier}).then(r=>{console.log(htmlres.printers.printerIdentifier)
                            console.log("Printed Successfully.")
                        })
                    }
                    else{
                        this.setState({printerror: true})
                    }
                })
            }
            else{ 
                var final_printed_data = '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"></head><body>';
                final_printed_data += "<div style='max-width:270px'>"+htmlres.htmlMsg+"</div>";
                final_printed_data += '</body></html>';
                if(htmlres.printers.printerIdentifier !== undefined){
                    window.api.printHTML({html:final_printed_data , printername:htmlres.printers.printerIdentifier}).then(r=>{
                        console.log("Printed Successfully.")
                    })
                }
                else{
                    this.setState({printerror: true})
                }
            }
        })
    }

    loadData(){
        this.setState({isLoading: true})
        var  detail = window.localStorage.getItem('merchantdetail');
        if(detail !== undefined && detail !== 'undefined'){
            var businessdetail = JSON.parse(detail); 
            this.setState({isLoading:true,businessdetail:businessdetail}, function(){ 
                if(this.props.ticketDetail !== undefined){
                    console.log(this.props.ticketDetail)
                    // this.props.ticketDetail
                    // this.paymentController.getTicketDetail(this.props.ticketDetail.sync_id).then(res=>{
                    //     if(res.paid_status==='paid'){
                    //         this.props.afterSubmit();
                    //     }
                    //     else{
                    //         this.setState({ticketDetail : res}, function(){ 
                    //             console.log(this.state.ticketDetail)
                    //             if(this.state.ticketDetail.ticketPendingAmount === null || this.state.ticketDetail.ticketPendingAmount === ''){
                    //                 var obj = Object.assign({}, this.state.ticketDetail);
                    //                 obj.ticketPendingAmount = this.state.ticketDetail.grand_total
                    //                 this.setState({remainAmount: this.state.ticketDetail.grand_total, topayamount: this.state.ticketDetail.grand_total,  ticketDetail:obj},()=>{ 
                    //                     this.getTicketPayments();
                    //                 })
                    //             }
                    //             else{
                    //                 this.setState({remainAmount: this.state.ticketDetail.ticketPendingAmount, topayamount: this.state.ticketDetail.ticketPendingAmount},()=>{ 
                                        this.getTicketPayments();
                    //                 })
                    //             }
                    //         })
                    //     }
                    // })
                }
                var employeedetail = window.localStorage.getItem('employeedetail');
                if(employeedetail !== undefined){
                    this.setState({employeedetail:JSON.parse(employeedetail)})
                }
            });
        }
    }
    getPaymentValues(x,n){
        var values = []; 
        var x1 = Math.round((x+1) / 10) * 10; 
        if(x%10 === 0){
            x1 = Math.round((x+5) / 5) * 5; 
        }
        values.push(x1);
        var x2 = Math.round((x1+10) / 10) * 10;
        if(x%10 === 0){
            x2 = Math.round((x+5) / 10) * 10;
        }
        values.push(x2);
        if(n === 3){ 
            var x3 = Math.round((x2+10) / 10) * 10;
            values.push(x3);
        }
        return values;
    }

    getTicketPayments(){
        this.httpManager.postRequest(`merchant/payment/getpayments`, {data: this.props.ticketDetail}).then(res=>{
            this.setState({ticketpayments: res.data, topayamount: res.remainAmount, remainAmount: res.remainAmount, isLoading:false});
            // if(res.remainAmount <= 0){
            //     window.location.href="/"
            // }
        })
        // this.paymentController.getTicketPayments(this.state.ticketDetail.sync_id).then(res=>{ 
        //     console.log("ASdasdasdasds")
        //     console.log(res);
        //     this.setState({ticketpayments: res, isLoading:false});
        // })
    }

    renderPaymentTabs(){
        return <div style={{display:'flex', width:'100%', background:'transparent', flexDirection:'column', position:'relative'}}>
              {this.props.ticketDetail.paymentStatus !== 'Paid' && <>    {!this.state.paymentSplitted && <>
                    <div>
                        <div className='paymentTabContainer'>
                            <div className={this.state.activeTab === 'full' ? 'paymenttab active' : 'paymenttab'} onClick={()=>{
                                this.setState({activeTab: 'full'})
                            }}>Pay Full Amount</div>
                            <div className={this.state.activeTab === 'split' ? 'paymenttab active' : 'paymenttab'} onClick={()=>{
                                this.setState({activeTab: 'split'})
                            }}>Split Custom Amount</div>
                        </div>
                    </div>

                    {this.state.activeTab==='full' && <TicketFullPayment data={{
                        ticketDetail:this.props.ticketDetail,
                        topayamount: this.state.topayamount,
                        customerDetail:this.props.customerDetail,
                        completePayment:()=>{
                            this.props.afterSubmit();
                            this.getTicketPayments();
                        }
                    }} />}

                    
                    {this.state.activeTab==='split' && <TicketSplitPayment data={{
                        ticketDetail:this.props.ticketDetail,
                        topayamount: this.state.topayamount,
                        remainAmount: this.state.remainAmount,
                        onselectedWays: (splitamt)=>{
                            this.setState({splittedAmount: splitamt, paymentSplitted: true})
                        }
                    }} />}
                </>}

                {this.state.paymentSplitted && <><TicketFullPayment data={{
                        ticketDetail:this.props.ticketDetail,
                        topayamount: this.state.splittedAmount,
                        customerDetail:this.props.customerDetail,
                        completePayment:()=>{
                            this.setState({splittedAmount: 0, paymentSplitted: false})
                            this.props.afterSubmit();
                            // window.location.reload()
                            this.loadData();
                        }
                    }} />
                        
                        <Grid item xs={12} style={{display:'flex',marginTop:10, position:'absolute', bottom:20, left:0, right:0}}>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center'}}> 
                                <Button style={{marginRight: 10}} onClick={()=>{
                                    this.setState({splittedAmount: 0, paymentSplitted: false}, ()=>{
                                        this.props.afterSubmit();
                                        // window.location.reload()
                                        this.loadData();
                                    })
                                }} color="secondary" variant="contained">Cancel</Button> 
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>

                    </>}
</>}

{this.props.ticketDetail.paymentStatus === 'Paid' && <>  
<div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:'1rem'}}>
                 <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">How would you like your receipt?</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <Grid container spacing={2} >
                    <Grid item xs={4} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:  '1px solid #134163', margin:10,borderRadius:10, cursor:'pointer', background: 'transparent' }} align="left" onClick={()=>{
                            this.getPrintHTML('bill')
                        }}>Print Bill</Typography>
                    </Grid>  
                     <Grid item xs={4} style={{display:'flex'}}> 
                       <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border: '1px solid #134163', margin:10,borderRadius:10, cursor:'pointer', background: 'transparent' }} align="left" onClick={()=>{
                             this.getPrintHTML('receipt')
                        }}>Print Receipt</Typography>
                    </Grid>  
                    <Grid item xs={4} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border: '1px solid #134163', margin:10,borderRadius:10, cursor:'pointer', background: 'transparent' }} align="left" onClick={()=>{
                            this.getPrintHTML('empreceipt') 
                        }}>Print Employee Receipt</Typography>
                    </Grid>  
                    
                </Grid>
            </div> 
</>}
        </div>
    }


    onSelectCustomer(obj, opt){
        this.props.selectCustomerDetail(obj, opt)
        this.setState({selectCustomerPopup: false})
    }

    render(){
        return  <Box sx={paymentStyle} style={{borderRadius: 10, height:'100%', zIndex:9999}}>
            {this.state.isLoading && <LoadingModal />}

            <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0'}}>
                <Grid item xs={12} style={{display:'flex'}}> 
                    <Grid item xs={10}>
                        <Typography id="modal-modal-title" variant="subtitle" align="left" style={{"color":'#000', fontWeight:'500'}}>
                          Pay Full Amount (${Number(this.props.ticketDetail.ticketTotalAmount).toFixed(2)})
                        </Typography>
                    </Grid>
                    <Grid item xs={2} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
                        {this.props.ticketDetail.ticketType !== 'GiftCard' && <div style={{marginRight:'10px', display:'flex', flexDirection:'row', alignItems:'center', cursor:'pointer', justifyContent:'flex-end'}} 
                                onClick={()=>{ 
                                    if(this.props.pageFrom === 'Ticket'){
                                            this.setState({selectCustomerPopup: true})
                                    }
                                }}>
                            <AccountCircle fontSize="large" className={"accnticon"}  /> 
                                 {this.props.customerDetail.mCustomerName !== undefined && <Typography variant="subtitle2" align="right" style={{cursor:'pointer', display:'flex', alignItems:'center', fontWeight:'500'}}>
                                    {this.props.customerDetail.mCustomerName}
                                 </Typography> }
                        </div>}
                        <Typography variant="subtitle2" align="right" style={{cursor:'pointer', display:'flex', alignItems:'center'}} onClick={() => this.props.handleClosePayment()}> 
                            <CloseIcon fontSize="small" style={{"color":'#134163'}}/>
                        </Typography>
                    </Grid>      
                </Grid>
            </Grid>

            {this.state.selectCustomerPopup && 
                     <DialogComponent open={this.state.selectCustomerPopup} title={'Select Customer'}  onClose={()=>{
                        this.setState({selectCustomerPopup: false})
                     }} > <SelectCustomer customerDetail={this.props.customerDetail} handleCloseCustomer={()=>{this.setState({selectCustomerPopup: false})}} onSelectCustomer={(obj, opt)=>this.onSelectCustomer(obj, opt)}/>
                    </DialogComponent>}

            {this.state.printerror && 
                     <DialogComponent open={this.state.printerror} title={'Error'}  onClose={()=>{
                        this.setState({selectCustomerPopup: false})
                     }} > 
                       <p>No Printer selected</p> 
                    </DialogComponent>}

            <Grid container spacing={2} style={{height:'calc(100% - 18px)', marginTop:'7px'}}>
                {this.props.ticketDetail.ticketType === 'GiftCard' && <Grid item xs={3}>
                    <Typography id="modal-modal-title" variant="h6" align="left" style={{"color":'#000', fontWeight:'700'}}>
                        Customer Order
                    </Typography>
                    <div style={{display:'flex', height:'calc(100% - 50px)', marginTop:'10px', alignItems:'center', justifyContent:'space-between', flexDirection:'column'}}>
                        <div style={{display:'flex', marginTop:'10px',width:'100%', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                            <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Gift Card  <span style={{paddingLeft:'20px'}}>x1</span></Typography>
                            <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.ticketSubTotal).toFixed(2)}</Typography>
                        </div> 
                        <div style={{display:'flex', marginTop:'10px', alignItems:'center', flexDirection:'column', width:'100%'}}>
                            <div style={{display:'flex', marginTop:'10px', alignItems:'center', justifyContent:'space-between', width:'100%', flexDirection:'row'}}>
                                <Typography  id="modal-modal-title" variant="h6"  style={{"color":'#000', fontWeight:'500'}} align="left"> Sub Total</Typography>
                                <Typography id="modal-modal-title" variant="h6"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.ticketSubTotal).toFixed(2)}</Typography>
                            </div> 
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', flexDirection:'row'}}>
                                <Typography  id="modal-modal-title" variant="h6"  style={{"color":'#000', fontWeight:'500'}} align="left"> Tax</Typography>
                                <Typography id="modal-modal-title" variant="h6"  style={{"color":'#000', fontWeight:'500'}} align="left"> $0.00</Typography>
                            </div> 
                            <div style={{display:'flex',  alignItems:'center', justifyContent:'space-between', width:'100%', flexDirection:'row'}}>
                                <Typography  id="modal-modal-title" variant="h6"  style={{"color":'#000', fontWeight:'500'}} align="left"> Total</Typography>
                                <Typography id="modal-modal-title" variant="h6"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.grandTotal).toFixed(2)}</Typography>
                            </div> 
                        </div>
                   </div>
                </Grid>}
                <Grid item xs={this.props.ticketDetail.ticketType !== 'GiftCard' ? '4' :'3'} style={{ height:'100%', borderRight:'1px solid #f0f0f0;', background:'#f0f0f0', borderRadius:'0 0 0 10px', display:'flex', flexDirection:'column'}}> 
                    <Typography id="modal-modal-title" variant="h6" align="left" style={{"color":'#000', fontWeight:'700'}}>
                        Pay for this Order
                    </Typography>
                    <div style={{display:'flex', marginTop:'10px', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Order Subtotal</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.ticketSubTotal).toFixed(2)}</Typography>
                   </div> 
                   
                   {this.props.ticketDetail.ticketType !== 'GiftCard' && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Tips</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.tipsAmount).toFixed(2)}</Typography>
                   </div>}
                   
                   {this.props.ticketDetail.ticketType !== 'GiftCard' && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Discount</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.ticketDiscount).toFixed(2)}</Typography>
                   </div>}
                   
                   {this.props.ticketDetail.ticketType !== 'GiftCard' && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Tax</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.taxAmount).toFixed(2)}</Typography>
                   </div>}
                   
                   <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left">Total</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.props.price.grandTotal).toFixed(2)}</Typography>
                   </div> 
                             
                    {this.state.ticketpayments.map((p, idx)=>{
                        return <div style={{display:'flex',marginTop:'5px', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                                    <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'500', fontSize:'16px'}} align="left">Payment {idx+1}  <span style={{textTransform:'capitalize'}}>{"("+p.payMode+")"}</span> </Typography>
                                    <Typography id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'500', fontSize:'16px'}} align="left"> (${Number(p.ticketPayment).toFixed(2)})</Typography>
                            </div>  
                    })}
                   
                   <div style={{display:'flex',marginTop:'5px', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Amount Remaining</Typography>
                        <Typography id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left"> ${Number(this.state.remainAmount).toFixed(2)}</Typography>
                   </div>           
                </Grid>
                <Grid item xs={this.props.ticketDetail.ticketType !== 'GiftCard' ? '8' :'6'} style={{display:'flex' , height:'100%'}}> 
                        {this.renderPaymentTabs()}
                </Grid>
            </Grid>
        </Box>
    }


}
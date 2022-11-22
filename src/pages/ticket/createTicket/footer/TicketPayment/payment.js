import React from 'react';
import Moment from 'moment';
import { Grid, Typography, Button,Box, FormControl,FormLabel,FormControlLabel,Radio,RadioGroup} from '@material-ui/core/'; 
import LoadingModal from '../../../../components/Modal/loadingmodal';
import CloseIcon from '@mui/icons-material/Close'; 
import AlertModal from '../../../../components/Modal/alertModal';
import PaymentController from '../../../../controller/paymentController';
import TicketFullPayment from './payfull';
import TicketSplitPayment from './splitpay';
import './tab.css';

const paymentStyle = {
    position: 'absolute',
    top: '0', 
    left:'0',
    width: '100%',
    bgcolor: 'background.paper',
    border: '0',
    boxShadow: 24,
    pt: 2,
    pb:2,
    pl:1,
    pr:1
};

export default class TicketPayment extends React.Component  {

    paymentController = new PaymentController();

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
            splittedAmount: 0
        }

        this.getTicketPayments = this.getTicketPayments.bind(this);
    }

    
    componentDidMount(){ 
        this.loadData()
    } 

    loadData(){
        this.setState({isLoading: true})
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            var businessdetail = JSON.parse(detail); 
            this.setState({isLoading:true,businessdetail:businessdetail}, function(){ 
                if(this.props.ticketDetail !== undefined){
                    console.log(this.props.ticketDetail.sync_id)
                    this.paymentController.getTicketDetail(this.props.ticketDetail.sync_id).then(res=>{
                        if(res.paid_status==='paid'){
                            this.props.afterSubmit();
                        }
                        else{
                            this.setState({ticketDetail : res}, function(){ 
                                console.log(this.state.ticketDetail)
                                if(this.state.ticketDetail.ticketPendingAmount === null || this.state.ticketDetail.ticketPendingAmount === ''){
                                    var obj = Object.assign({}, this.state.ticketDetail);
                                    obj.ticketPendingAmount = this.state.ticketDetail.grand_total
                                    this.setState({remainAmount: this.state.ticketDetail.grand_total, topayamount: this.state.ticketDetail.grand_total,  ticketDetail:obj},()=>{ 
                                        this.getTicketPayments();
                                    })
                                }
                                else{
                                    this.setState({remainAmount: this.state.ticketDetail.ticketPendingAmount, topayamount: this.state.ticketDetail.ticketPendingAmount},()=>{ 
                                        this.getTicketPayments();
                                    })
                                }
                            })
                        }
                    })
                }
                var employeedetail = window.localStorage.getItem('employeedetail');
                if(employeedetail !== undefined){
                    this.setState({employeedetail:JSON.parse(employeedetail)})
                }
            });
        }
    }

    getTicketPayments(){
        this.paymentController.getTicketPayments(this.state.ticketDetail.sync_id).then(res=>{ 
            console.log("ASdasdasdasds")
            console.log(res);
            this.setState({ticketpayments: res, isLoading:false});
        })
    }

    renderPaymentTabs(){
        return <div style={{display:'flex', width:'100%', background:'transparent', flexDirection:'column', position:'relative'}}>
                {!this.state.paymentSplitted && <>
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
                        ticketDetail:this.state.ticketDetail,
                        topayamount: this.state.topayamount,
                        completePayment:()=>{
                            this.props.afterSubmit();
                        }
                    }} />}

                    
                    {this.state.activeTab==='split' && <TicketSplitPayment data={{
                        ticketDetail:this.state.ticketDetail,
                        topayamount: this.state.topayamount,
                        onselectedWays: (splitamt)=>{
                            this.setState({splittedAmount: splitamt, paymentSplitted: true})
                        }
                    }} />}
                </>}

                {this.state.paymentSplitted && <><TicketFullPayment data={{
                        ticketDetail:this.state.ticketDetail,
                        topayamount: this.state.splittedAmount,
                        completePayment:()=>{
                            this.setState({splittedAmount: 0, paymentSplitted: false})
                            // this.props.afterSubmit();
                            this.loadData();
                        }
                    }} />
                        
                        <Grid item xs={12} style={{display:'flex',marginTop:10, position:'absolute', bottom:20, left:0, right:0}}>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center'}}> 
                                <Button style={{marginRight: 10}} onClick={()=>{
                                    this.setState({splittedAmount: 0, paymentSplitted: false}, ()=>{
                                        this.loadData();
                                    })
                                }} color="secondary" variant="contained">Cancel</Button> 
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>

                    </>}

        </div>
    }

    render(){
        return  <Box sx={paymentStyle} style={{borderRadius: 10, height:'100%', zIndex:9999}}>
            {this.state.isLoading && <LoadingModal />}

            <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0'}}>
                <Grid item xs={12} style={{display:'flex'}}> 
                    <Grid item xs={10}>
                        <Typography id="modal-modal-title" variant="subtitle" align="left" style={{"color":'#000', fontWeight:'500'}}>
                            Pay Full Amount (${Number(this.state.ticketDetail.grand_total).toFixed(2)})
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={() => this.props.afterSubmit()}> 
                            <CloseIcon fontSize="small" style={{"color":'#134163'}}/>
                        </Typography>
                    </Grid>      
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{height:'calc(100% - 18px)', marginTop:'7px'}}>
                <Grid item xs={4} style={{ height:'100%', borderRight:'1px solid #f0f0f0;', background:'#f0f0f0', borderRadius:'0 0 0 10px', display:'flex', flexDirection:'column'}}> 
                    <Typography id="modal-modal-title" variant="h6" align="left" style={{"color":'#000', fontWeight:'700'}}>
                        Pay for this Order
                    </Typography>
                    <div style={{display:'flex', marginTop:'10px', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Order Subtotal</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.state.ticketDetail.subtotal).toFixed(2)}</Typography>
                   </div> 
                   
                   <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Tips</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.state.ticketDetail.tips_totalamt).toFixed(2)}</Typography>
                   </div>
                   
                   <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Discount</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.state.ticketDetail.discount_totalamt).toFixed(2)}</Typography>
                   </div>
                   
                   <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> Tax</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.state.ticketDetail.total_tax).toFixed(2)}</Typography>
                   </div>
                   
                   <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left">Total</Typography>
                        <Typography id="modal-modal-title" variant="subtitle2"  style={{"color":'#000', fontWeight:'500'}} align="left"> ${Number(this.state.ticketDetail.grand_total).toFixed(2)}</Typography>
                   </div> 
                             
                    {this.state.ticketpayments.map((p, idx)=>{
                        return <div style={{display:'flex',marginTop:'5px', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                                    <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'500', fontSize:'16px'}} align="left">Payment {idx+1}</Typography>
                                    <Typography id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'500', fontSize:'16px'}} align="left"> ${Number(p.ticket_amt).toFixed(2)}</Typography>
                            </div>  
                    })}
                   
                   <div style={{display:'flex',marginTop:'5px', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Amount Remaining</Typography>
                        <Typography id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left"> ${Number(this.state.remainAmount).toFixed(2)}</Typography>
                   </div>           
                </Grid>
                <Grid item xs={8} style={{display:'flex' , height:'100%'}}> 
                        {this.renderPaymentTabs()}
                </Grid>
            </Grid>
        </Box>
    }


}
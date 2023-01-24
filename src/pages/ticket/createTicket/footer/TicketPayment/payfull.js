import React from 'react';   
import {  Dialog, DialogTitle, DialogContent} from '@mui/material'; 
import {Grid,  Typography, Button,Box, FormControl,  InputAdornment, TextareaAutosize  } from '@material-ui/core/'; 
import {TextField, Select, MenuItem} from '@mui/material'; 
import CreditCard from '@mui/icons-material/CreditCard';
import Currency from '@mui/icons-material/LocalAtm'; 
import { CardGiftcardOutlined, Close } from '@mui/icons-material';
import HTTPManager from '../../../../../utils/httpRequestManager';
import FTextField from '../../../../../components/formComponents/components/textField';
import FButton from '../../../../../components/formComponents/components/button';
import FMaskTextField from '../../../../../components/formComponents/components/masktextfield';
import './tab.css'; 

export default class TicketFullPayment extends React.Component  { 
    httpManager = new HTTPManager()
    constructor(props){
        super(props);
        this.state={
            notesPopup: false,
            description: '', 
            card_type:'',
            completionPopup: false,
            tenderedamt:'',
            paidamt:'',
            selectedAmount:0,
            CashCustomPopup: false,
            cashCustomAmount: 0,
            alertToast: false,
            cardtype : '',
            giftcardPopup: false,
            giftcardnumber: '',
            giftCardError: false,
            giftCardErrorText:'',
            redeemamount:'',
            validgiftcard: false,
            giftcard:{},
            loyaltyPopup: false,
            loyaltyPointSettings:{},
            redeempoints: '',
            loyaltyValueSettings:{}
        }
        this.handlechangeDesc = this.handlechangeDesc.bind(this)
        this.cashPayment = this.cashPayment.bind(this);
        this.handlechange = this.handlechange.bind(this);
        this.verifyAmount = this.verifyAmount.bind(this);

        this.checkBalance = this.checkBalance.bind(this);
        this.checkDisable = this.checkDisable.bind(this)
        this.checkPointsDisable = this.checkPointsDisable.bind(this);
        this.checkAndPayLoyaltyPoints = this.checkAndPayLoyaltyPoints.bind(this)
    }

    checkAndPayLoyaltyPoints(){
        var value = Number(this.state.redeempoints) * Number(this.state.loyaltyValueSettings.dollarValue)

        this.httpManager.postRequest('merchant/payment/payByLoyaltyPoints',{ticketDetail:this.props.data.ticketDetail,customerId: this.props.data.customerDetail.mCustomerId,value: value, points: this.state.redeempoints, dollarValue: this.state.loyaltyValueSettings.dollarValue}).then(r=>{
            this.setState({loyaltyPopup: false, redeempoints: ''}) 
            this.props.data.completePayment()
        }).catch(e=>{ 
        })
    }

    checkPointsDisable(){
        var value = Number(this.state.redeempoints) * Number(this.state.loyaltyValueSettings.dollarValue) 
        // console.log(value, this.props.data.topayamount)
        // console.log( Number(this.state.redeempoints) > 0, Number(value) <= Number(this.props.data.topayamount), Number(this.props.data.customerDetail.LoyaltyPoints) * (Number(this.state.loyaltyPointSettings.maxRedeemPoint)/100))
        if(Number(value) <= Number(this.props.data.topayamount) && Number(this.props.data.customerDetail.LoyaltyPoints) * (Number(this.state.loyaltyPointSettings.maxRedeemPoint)/100) >= Number(this.state.redeempoints) && Number(this.state.redeempoints) > 0){
            return false
        }
        else{
            return true;
        }
    }

    checkBalance(){
        this.httpManager.postRequest('merchant/giftcard/checkBalance', {cardNumber: this.state.giftcardnumber.replaceAll('-','')}).then(res=>{
            this.setState({giftcard: res.data, validgiftcard: true})
        }).catch(e=>{
            if(e.message){
                this.setState({giftCardError: true, giftCardErrorText: e.message})
            }
        })
    }


    handlechangeDesc(e){
        console.log(e)
        this.setState({description: e.target.value})
    }
    componentDidMount(){  
        this.setState({redeemamount:  this.props.data.topayamount})
        console.log("MOUNT CALLED")
        this.httpManager.postRequest(`merchant/lpsettings/getActivationSettings`,{data:"FROM TABLE"}).then(response=>{ 
            // this.openEdit(response.data); 
            if(response.data){
                if(response.data.id !== undefined){
                    this.setState({loyaltyPointSettings: response.data, isLoading: false }, ()=>{
                            console.log(this.state.loyaltyPointSettings)
                    });
                }
                else{
                    this.setState({loyaltyPointSettings: {
                        thresholdRedeemPoint: 0,
                        maxRedeemPoint: 100
                    }, isLoading: false }, ()=>{
                        console.log(this.state.loyaltyPointSettings)
                    });
                }
            }
            else{ 

                this.setState({loyaltyPointSettings: {
                    thresholdRedeemPoint: 0,
                    maxRedeemPoint: 100
                }, isLoading: false }, ()=>{
                    console.log(this.state.loyaltyPointSettings)
                });
            }

            this.httpManager.postRequest(`merchant/lpsettings/getSettings`,{data:"FROM TABLE"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data){
                    this.setState({loyaltyValueSettings: response.data, isLoading: false }, ()=>{
                            console.log(this.state.loyaltyValueSettings)
                    });
                }
                else{
                    this.setState({isLoading: false})
                }
            })

        })
        
    }

    renderNotes(){
        return <Dialog
    style={{zIndex:'99999'}}
    className="paynotespopup"
    open={true}
    onClose={()=>{
        this.setState({notesPopup: false})
    }}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
                {/* <ModalTitleBar onClose={()=> this.setState({notesPopup: false}) } title="Notes"/>   */}
                <Grid item xs={12} style={{display:'flex',margin :10}}>
                    <Grid item xs={4} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px',border:this.state.cardtype === 'VISA' ? '1px solid #bee1f7': '1px solid #134163', background:this.state.cardtype === 'VISA' ? '#bee1f7' :'transparent', margin:10,borderRadius:10, cursor:'pointer'}} align="left" onClick={()=>{
                            this.setState({cardtype: 'VISA'})
                        }}>VISA</Typography>
                    </Grid>
                    <Grid item xs={4} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:this.state.cardtype === 'Master' ? '1px solid #bee1f7': '1px solid #134163', background:this.state.cardtype === 'Master' ? '#bee1f7' :'transparent', margin:10,borderRadius:10, cursor:'pointer'}} align="left" onClick={()=>{
                            this.setState({cardtype: 'Master'})
                        }}>Master</Typography>
                    </Grid>
                    <Grid item xs={4} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:this.state.cardtype === 'American Express' ? '1px solid #bee1f7': '1px solid #134163', background:this.state.cardtype === 'American Express' ? '#bee1f7' :'transparent', margin:10,borderRadius:10, cursor:'pointer'}} align="left" onClick={()=>{
                            this.setState({cardtype: 'American Express'})
                        }}>American Express</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex',margin :10}}>
                        <TextField 
                            fullWidth
                            label="Notes"
                            name="Notes"
                            id="Notes"
                            rows={3} 
                            multiline
                            // value={this.state.description}
                            onChange={this.handlechangeDesc} 
                        />
                </Grid>
                {/* <Grid item xs={12} style={{display:'flex',margin :10}}>
                <FormControl fullWidth> 
                        <Select
                            label="Card Type"
                            id="Card Type"
                            value={this.state.cardtype}
                            variant="standard"
                            placeholder="Select Card Type"
                            name="cardtype" 
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={(e)=>{ 
                                this.setState({cardtype:e.target.value}, function(){ 
                                    
                                });
                            }}
                        >
                            <MenuItem value={''} selected>Select Card Type</MenuItem> 
                            <MenuItem value={'VISA'}>VISA</MenuItem> 
                            <MenuItem value={'VISA Master'}>VISA Master</MenuItem>
                            <MenuItem value={'American Express'}>American Express</MenuItem> 
                        
                        </Select>
                    </FormControl>
                </Grid> */}
                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center'}}> 
                        <Button style={{marginRight: 10}} onClick={()=>{
                            var input = {
                                amountpaying: this.props.data.topayamount,
                                ticketDetail: this.props.data.ticketDetail,
                                paymode: 'card',
                                cardtype: this.state.cardtype,
                                creditordebit: this.state.card_type,
                                description: this.state.description,
                                customerPaid:'',
                                returnedamt:'',
                                ticketpayment: this.props.data.topayamount,
                                paymentnotes: this.state.description
                            }
                            this.httpManager.postRequest('merchant/payment/savePayment', input).then(res=>{
                                this.setState({notesPopup: false}, ()=>{
                                    this.props.data.completePayment();
                                })
                            })
                        }} disabled={this.state.cardtype === '' || this.state.description.trim() === ''} color="secondary" variant="contained">Save</Button> 
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                </DialogContent>
        </Dialog>
    }

    selectPayment(amt){
        this.setState({selectedAmount : amt});
    }
    

    cashPayment(amt){
        if(this.props.data.topayamount > 0){
            this.setState({tenderedamt: amt}, ()=>{
                var input = {
                    amountpaying: this.props.data.topayamount,
                    ticketDetail: this.props.data.ticketDetail,
                    paymode: 'cash',
                    cardtype: '',
                    creditordebit: '',
                    description: this.state.description,
                    customerPaid:this.state.tenderedamt,
                    returnedamt:Number(this.state.tenderedamt) - Number(this.props.data.topayamount),
                    ticketpayment: this.props.data.topayamount,
                    paymentnotes: this.state.description
                }
                this.httpManager.postRequest('merchant/payment/savePayment', input).then(res=>{
                    this.setState({notesPopup: false}, ()=>{
                        // this.props.data.completePayment();
                        this.setState({completionPopup: true})
                    })
                })
                // this.paymentController.savePayment(this.props.data.topayamount, this.props.data.ticketDetail, 'cash', '', '').then(r=>{
                //     this.setState({notesPopup: false}, ()=>{
                //         this.setState({completionPopup: true})
                //     })
                // })
            })
        }
    } 
    
    renderCompletion(){
        return  <div className="modalbox">
            <div className='modal_backdrop'>
            </div>
            <div className='modal_container' style={{height:'400px', width:'600px'}}>  
                <Grid item xs={12} style={{display:'flex',margin :10,padding:'20px'}}>  
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8} style={{display: 'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700',marginBottom:'1rem', fontSize:'20px'}} align="left">Cash Tendered: ${Number(this.state.tenderedamt).toFixed(2)}</Typography>
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700', fontSize:'20px'}} align="left">Cash Balance: ${(Number(this.state.tenderedamt) - Number(this.props.data.topayamount)).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:10, position:'absolute', bottom:20, left:0, right:0}}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center'}}> 
                        <Button style={{marginRight: 10}} onClick={()=>{
                            this.setState({completionPopup: false})
                             this.props.data.completePayment();
                        }} color="secondary" variant="contained">OK</Button> 
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </div>
        </div>
    }


    getPaymentValues(x,n){
        var values = []; 
        var x1 = Math.round((x+1) / 10) * 10;  
        if(x1%10 === 0 ){
            x1 = Math.round((x+5) / 5) * 5; 
        }
        values.push(x1);
        var x2 = Math.round((x1+10) / 10) * 10;
        if(x2%10 === 0){
            x2 = Math.round((x1+5) / 10) * 10;
        }
        values.push(x2);
        if(n === 3){ 
            var x3 = Math.round((x2+10) / 10) * 10;
            values.push(x3);
        } 
        return values;
    }
    
    renderCardMethods(){
        return <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
          <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <CreditCard/>&nbsp;
                <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Card</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row',  borderBottom:'1px solid #f0f0f0', paddingBottom:'2rem'}}>
                <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163',borderRadius:10, margin:10, cursor:'pointer'}} align="left" 
                onClick={()=>{
                    this.setState({card_type:'credit', notesPopup: true})
                }}>
                    Credit Card
                </Typography>
                <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', borderRadius:10,margin:10, cursor:'pointer'}} align="left"
                onClick={()=>{
                    this.setState({card_type:'debit', notesPopup: true})
                }}>
                    Debit Card
                </Typography>
            </div>  



            <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:'1rem'}}>
                <Currency/>&nbsp;
                <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Cash</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <Grid container spacing={2} >
                    <Grid item xs={3} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:this.state.selectedAmount === this.props.data.topayamount ? '1px solid #bee1f7':'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer', background:this.state.selectedAmount === this.props.data.topayamount ? '#bee1f7' :'transparent' }} align="left" onClick={()=>{
                            this.selectPayment(this.props.data.topayamount)
                        }}>{Number(this.props.data.topayamount).toFixed(2)}</Typography>
                    </Grid> 

                    {Math.ceil(Number(this.props.data.topayamount)).toFixed(2) !==  Number(this.props.data.topayamount).toFixed(2)  && <Grid item xs={3} style={{display:'flex'}}> 
                         <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:this.state.selectedAmount === Math.ceil(Number(this.props.data.topayamount)) ? '1px solid #bee1f7':'1px solid #134163',  background:this.state.selectedAmount === Math.ceil(Number(this.props.data.topayamount)) ? '#bee1f7' :'transparent', margin:10,borderRadius:10, cursor:'pointer'}} align="left"
                          onClick={()=>{
                            this.selectPayment(Math.ceil(Number(this.props.data.topayamount)))
                        }}
                        >{Math.ceil(Number(this.props.data.topayamount)).toFixed(2)}</Typography> 
                    </Grid>}
                    
                
                    {Math.ceil(Number(this.props.data.topayamount)).toFixed(2) ===  Number(this.props.data.topayamount).toFixed(2) &&  this.getPaymentValues(Math.ceil(Number(this.props.data.topayamount)), 3).map(t=>{
                        return <Grid item xs={3} style={{display:'flex'}}>
                                    <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:this.state.selectedAmount === t ? '1px solid #bee1f7': '1px solid #134163', background:this.state.selectedAmount === t ? '#bee1f7' :'transparent', margin:10,borderRadius:10, cursor:'pointer'}} align="left"
                                     onClick={()=>{
                                        this.selectPayment(t)
                                    }}>{Number(t).toFixed(2)}</Typography>
                                </Grid>
                    })} 
                    
                    {Math.ceil(Number(this.props.data.topayamount)).toFixed(2) !==  Number(this.props.data.topayamount).toFixed(2) &&  this.getPaymentValues(Math.ceil(Number(this.props.data.topayamount)), 2).map(t=>{
                        return <Grid item xs={3} style={{display:'flex'}}>
                                    <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left"
                                     onClick={()=>{
                                        this.selectPayment(t)
                                    }}>{Number(t).toFixed(2)}</Typography>
                                </Grid>
                    })} 
                    
                </Grid>
            </div> 
            <div style={{display:'flex', flexDirection:'row',borderBottom:'1px solid #f0f0f0', paddingBottom:'2rem'}}>
                <Grid container spacing={2} >
                    <Grid item xs={3} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left" onClick={()=>{
                            this.setState({CashCustomPopup: true})
                        }}>Custom</Typography>
                    </Grid>
                    <Grid item xs={9} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left"  onClick={()=>{
                            if(Number(this.state.selectedAmount) > 0){
                                this.cashPayment(this.state.selectedAmount)
                            }
                            else{
                                this.setState({alertToast: true})
                            }
                        }}>Pay Cash</Typography>
                    </Grid>
                    <Grid item xs={12} style={{display:'flex', justifyContent:'center', alignItems:'center'}}> 
                        {this.state.alertToast && <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',  fontWeight:'700', width:'100%',  margin:10,borderRadius:10, cursor:'pointer', color:'red', fontSize:'12px'}} align="left" >
                            Please select amount.
                        </Typography> }
                    </Grid> 
                </Grid>
            </div>


    {this.props.data.ticketDetail.ticketType !== 'GiftCard' && <>
            <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:'1rem'}}>
                <CardGiftcardOutlined/>&nbsp;
                <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Others</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <Grid container spacing={2} >
                    <Grid item xs={3} style={{display:'flex'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:  '1px solid #134163', margin:10,borderRadius:10, cursor:'pointer', background: 'transparent' }} align="left" onClick={()=>{
                            this.setState({giftcardPopup: true, redeemamount: this.props.data.topayamount})
                        }}>Gift Card 
                        </Typography>
                    </Grid>  
                    <Grid item xs={3} style={{display:'flex', position:'relative'}}> 
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border: '1px solid #134163', margin:10,borderRadius:10, cursor:'pointer', background: 'transparent' }} align="left" onClick={()=>{
                            if(this.props.data.customerDetail !== undefined){
                                if(this.props.data.customerDetail.LoyaltyPoints){
                                    this.setState({loyaltyPopup: true})
                                }
                            }
                        }}>
                            Loyalty Points 
                        {this.props.data.customerDetail !== undefined && <Typography style={{position:'absolute',textAlign:'center', bottom:'20px', fontSize:'13px', color:"#666", left:0, right:0}} variant="subtitle" >
                            {this.props.data.customerDetail.LoyaltyPoints && <p>({this.props.data.customerDetail.LoyaltyPoints})</p>}
                        </Typography>}
                        </Typography>
                        
                    </Grid>  
                    
                </Grid>
            </div> 
            </>} 
        </div>
    }

    handlechange(e){
        if((e.target.value.match( "^.{"+7+","+7+"}$")===null)) {
            // console.log(e.target.value.length)
            if(e.target.value.length>=1) {
                this.setState({isDiabled: false})
            }
            else {
                this.setState({isDiabled: true})
            }
            this.setState({cashCustomAmount: e.target.value}) 
           
          }
       
    }

    verifyAmount(){
        if(this.state.cashCustomAmount < this.props.data.topayamount){
            this.setState({showError:true, errorMsg:`Amount should be greater than or equal to $`+ Number(this.props.data.topayamount).toFixed(2)})
        }
        else{
            this.setState({CashCustomPopup: false}, ()=>{
                this.cashPayment(this.state.cashCustomAmount)
            });
        }
    } 

    renderCashCustom(){
        return <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container' style={{height:'250px', width:'500px'}}> 
                    {/* <ModalTitleBar onClose={()=> this.setState({cashCustomAmount:0, CashCustomPopup: false})} title="Custom Payment"/>  */}
                    <Box style={{padding: 20}}>
                        <Grid container spacing={2}>    
                            <Grid container justify="center" xs={12} style={{  alignContent: 'center'}}>         
                            <TextField  
                                                        required 
                                                        type="number" 
                                                        placeholder="Enter Amount" 
                                                        value={this.state.cashCustomAmount}
                                                        name="variable_price"
                                                        color="secondary"   
                                                        variant="standard" 
                                                        style={{background: 'white'}}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        }}
                                                        onChange={(e)=>{this.handlechange(e)}}
                                                        onKeyDown={(e)=>{
                                                            if(e.key === 'e'  || e.key === "+" || e.key === "-"){
                                                                e.preventDefault();
                                                            }
                                                            if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) {
                                                            
                                                                e.preventDefault();
                                                            
                                                            }
                                                        }

                                                        }
                                                    />
                        
                        </Grid>
                        <Grid item xs={12} style={{display:'flex', marginTop: 5, marginBottom: 0, fontSize:'12px', color:'red'}}>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={8} style={{display:'flex', justifyContent:'center'}}>
                                    {this.state.errorMsg}
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid> 
                            <Grid item xs={12} style={{display:'flex', marginTop: 20, marginBottom: 20}}>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={8} style={{display:'flex', justifyContent:'center'}}>
                                    <Button style={{marginRight: 10}} color="secondary" onClick={()=>{
                                           this.verifyAmount() 
                                    }} fullWidth variant="contained" 
                                    disabled={this.state.isDiabled}>Pay</Button>
                                    <Button color="secondary" fullWidth variant="outlined" onClick={() => {this.setState({cashCustomAmount:0, CashCustomPopup: false})}} >Cancel</Button>
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid> 
                        </Grid>
                    </Box>
                </div>
            </div> 
    }

    checkAndPayGiftCard(){
        // console.log(this.state.giftcardnumber.replaceAll("-",""))
        this.httpManager.postRequest(`merchant/giftcard/checkandpay`,{cardNumber: this.state.giftcardnumber.replaceAll('-',''), amountToPay: (this.state.redeemamount || this.props.data.topayamount), ticketDetail:  this.props.data.ticketDetail}).then(res=>{
            this.setState({giftCardError: false, giftCardErrorText: ''})
            this.setState({giftcardPopup: false, giftcardnumber: ''})
            this.props.data.completePayment()
        }).catch(e=>{
            if(e.message){
                this.setState({giftCardError: true, giftCardErrorText: e.message})
            }
        })
    }

    checkDisable(){
        var disable = this.state.giftcardnumber.replaceAll('-','').length < 16 || !this.state.validgiftcard ;
        if(this.state.redeemamount !== '' && this.state.validgiftcard){
            console.log("checkin", this.state.redeemamount)
            disable = (Number(this.state.redeemamount) <= Number(this.state.giftcardPopup.cardBalance)) && (Number(this.state.redeemamount) < Number(this.state.amountToPay))
        }
        console.log(disable)
        return disable;
    }

    render(){
        return <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
            {this.renderCardMethods()} 
            {this.state.notesPopup && this.renderNotes()}
            {this.state.completionPopup && this.renderCompletion()}

            {this.state.CashCustomPopup && this.renderCashCustom() }



            <Dialog
                open={this.state.giftcardPopup}
                onClose={()=>{
                this.setState({giftcardPopup: false, giftcardnumber: ''})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{zIndex:'99999'}}
                className="giftpopup"
                modal={false}
                name="giftpopup"
            >
                <DialogTitle id="alert-dialog-title"> 
                    <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0'}}>
                            <Grid item xs={12} style={{display:'flex'}}> 
                                <Grid item xs={10}>
                                    <Typography id="modal-modal-title" variant="subtitle" align="left" style={{"color":'#000', fontWeight:'500'}}>
                                    Redeem
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={() => this.setState({giftcardPopup: false})}> 
                                        <Close  fontSize="small" style={{"color":'#134163'}}/>
                                    </Typography>
                                </Grid>      
                            </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>

                <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0', marginTop:'2rem'}}>
                            <Grid item xs={12} style={{display:'flex'}}> 
                                    <FMaskTextField  required={true} fullWidth error={this.state.giftCardError} helperText={this.state.giftCardErrorText} type={'text'} format={'number'} minLength={1} maxLength={16}  label={'Enter Card Number'} placeholder={'Enter Card Number'} name={'cardNumber'} value={this.state.giftcardnumber}   onChange={e=>{
                                        this.setState({giftcardnumber: e.target.value, validgiftcard: false, giftcard:{}})
                                    }} onBlur={()=>{
                                        this.checkBalance()
                                    }}/>
                            </Grid>
                            {this.state.validgiftcard && this.state.giftcard.cardBalance !== undefined && <>
                                <div style={{display:'flex', flexDirection:'row', color:"#999", fontWeight:'500', padding:'10px'}}>
                                    Current Gift Card Balance : <span style={{color:'green', fontWeight:700}}>${Number(this.state.giftcard.cardBalance).toFixed(2)}</span>
                                </div>

                                <Grid item xs={12} style={{display:'flex'}}> 
                                        <FTextField  required={true} fullWidth error={this.state.redeemError} helperText={this.state.redeemErrorText} type={'text'} format={'number'} minLength={1} maxLength={6}  label={'Amount to redeem'} placeholder={'Amount to redeem'} name={'cardNumber'} value={this.state.redeemamount }   onChange={e=>{
                                            this.setState({redeemamount: e.target.value})
                                        }} />
                                </Grid>
                            </>}
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4}>
                                <FButton fullWidth size="large" variant={'contained'} disabled={this.checkDisable()} label={"Redeem"} onClick={()=>{
                                    this.checkAndPayGiftCard()
                                }
                                }/>
                            </Grid>
                            <Grid item xs={4}></Grid>
                    </Grid>
                </DialogContent> 
            </Dialog> 



            <Dialog
                open={this.state.loyaltyPopup}
                onClose={()=>{
                this.setState({loyaltyPopup: false, redeempoints: ''})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{zIndex:'99999'}}
                className="giftpopup"
                modal={false}
                name="giftpopup"
            >
                <DialogTitle id="alert-dialog-title"> 
                    <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0'}}>
                            <Grid item xs={12} style={{display:'flex'}}> 
                                <Grid item xs={10}>
                                    <Typography id="modal-modal-title" variant="subtitle" align="left" style={{"color":'#000', fontWeight:'500'}}>
                                    Redeem Loyalty Points
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={() => this.setState({loyaltyPopup: false, redeempoints: ''})}> 
                                        <Close  fontSize="small" style={{"color":'#134163'}}/>
                                    </Typography>
                                </Grid>      
                            </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>

                {this.state.loyaltyValueSettings !== null && <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0', marginTop:'2rem'}}>  
                            <div style={{display:'flex', flexDirection:'row', color:"#999", fontWeight:'500', padding:'10px'}}>
                                Total Loyalty Points : <span style={{color:'green', fontWeight:700}}>{Number(this.props.data.customerDetail.LoyaltyPoints).toFixed(2)}&nbsp;&nbsp;{Number(this.state.loyaltyValueSettings.dollarValue) > 0&& <span>(${Number(this.props.data.customerDetail.LoyaltyPoints)*Number(this.state.loyaltyValueSettings.dollarValue)})</span>}</span>
                            </div> 
                            {Number(this.state.redeempoints) > 0 && <div style={{display:'flex',width:'100%', flexDirection:'row', color:"#999", fontWeight:'500', padding:'10px'}}>
                                 <span style={{color:'green', fontWeight:700}}>{this.state.redeempoints} points = ${ Number(this.state.redeempoints) * Number(this.state.loyaltyValueSettings.dollarValue) }</span>
                            </div> }

                            {(Number(this.props.data.customerDetail.LoyaltyPoints) < Number(this.state.loyaltyPointSettings.thresholdRedeemPoint)) &&<Grid item xs={12} style={{display:'flex'}}> 
                            <span style={{color:'red', fontWeight:700}}>Loyalty points should be greater than {Number(this.state.loyaltyPointSettings.thresholdRedeemPoint)}</span>
                            </Grid> }


                            {Number(this.props.data.customerDetail.LoyaltyPoints) * (Number(this.state.loyaltyPointSettings.maxRedeemPoint)/100) >= Number(this.props.data.customerDetail.LoyaltyPoints) &&<Grid item xs={12} style={{display:'flex'}}> 
                            <span style={{color:'#aaa', fontWeight:700}}>Customer can claim {Number(this.props.data.customerDetail.LoyaltyPoints)* (Number(this.state.loyaltyPointSettings.maxRedeemPoint)/100)} points only.</span>
                            </Grid> } 

                            
                            {(Number(this.props.data.customerDetail.LoyaltyPoints) >= Number(this.state.loyaltyPointSettings.thresholdRedeemPoint)) && <><Grid item xs={12} style={{display:'flex'}}> 
                                    <FTextField  required={true} fullWidth error={this.state.redeemError} helperText={this.state.redeemErrorText} type={'text'} format={'number'} minLength={1} maxLength={6}  label={'Points to redeem'} placeholder={'Points to redeem'} name={'redeempoint'} value={this.state.redeempoints }   onChange={e=>{
                                        this.setState({redeempoints: e.target.value})
                                    }} />
                            </Grid> 
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4}>
                                <FButton fullWidth size="large" variant={'contained'} disabled={this.checkPointsDisable()} label={"Redeem"} onClick={()=>{
                                    this.checkAndPayLoyaltyPoints()
                                }
                                }/>
                            </Grid>
                            <Grid item xs={4}></Grid>
                            </>}
                    </Grid>}



                {Number(this.state.loyaltyValueSettings.dollarValue) <= 0  && <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0', marginTop:'2rem'}}>  
                            <Grid item xs={12} style={{display:'flex'}}> 
                                <span style={{color:'red', fontWeight:700}}>Couldnt redeem points. Please check Loyalty point redeem settings.</span>
                            </Grid> 
 
                    </Grid>}
                </DialogContent> 
            </Dialog>  

        </div>
    }
}
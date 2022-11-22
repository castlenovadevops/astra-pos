import React from 'react';   
import {Grid,  Typography, Button,Box,   InputAdornment } from '@material-ui/core/'; 
import TextField from '@mui/material/TextField'; 
import PaymentController from '../../../../controller/paymentController';
import CreditCard from '@mui/icons-material/CreditCard';
import Currency from '@mui/icons-material/LocalAtm';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import TextareaAutosizeContent from '../../../../components/formComponents/TextAreaAutosize';

import './tab.css'; 

export default class TicketFullPayment extends React.Component  {
    paymentController = new PaymentController();

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
            alertToast: false
        }
        this.handlechangeDesc = this.handlechangeDesc.bind(this)
        this.cashPayment = this.cashPayment.bind(this);
        this.handlechange = this.handlechange.bind(this);
        this.verifyAmount = this.verifyAmount.bind(this);
    }


    handlechangeDesc(e){
        this.setState({description: e.target.value})
    }
    componentDidMount(){ 
    }

    renderNotes(){
        return  <div className="modalbox">
            <div className='modal_backdrop'>
            </div>
            <div className='modal_container' style={{height:'400px', width:'600px'}}> 
                <ModalTitleBar onClose={()=> this.setState({notesPopup: false}) } title="Notes"/>  
                <Grid item xs={12} style={{display:'flex',margin :10}}>
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
                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center'}}> 
                        <Button style={{marginRight: 10}} onClick={()=>{
                            this.paymentController.savePayment(this.props.data.topayamount, this.props.data.ticketDetail, 'card', this.state.card_type, this.state.description).then(r=>{
                                this.setState({notesPopup: false}, ()=>{
                                    this.props.data.completePayment();
                                })
                            })
                        }} color="secondary" variant="contained">Save</Button> 
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </div>
        </div>
    }

    selectPayment(amt){
        this.setState({selectedAmount : amt});
    }
    

    cashPayment(amt){
        this.setState({tenderedamt: amt}, ()=>{
            this.paymentController.savePayment(this.props.data.topayamount, this.props.data.ticketDetail, 'cash', '', '').then(r=>{
                this.setState({notesPopup: false}, ()=>{
                    this.setState({completionPopup: true})
                })
            })
        })
    } 
    
    renderCompletion(){
        return  <div className="modalbox">
            <div className='modal_backdrop'>
            </div>
            <div className='modal_container' style={{height:'400px', width:'600px'}}> 
                <ModalTitleBar onClose={()=>  {
                    this.setState({completionPopup: false});
                     this.props.data.completePayment();
                }} title="Payment Completion"/>  
                <Grid item xs={12} style={{display:'flex',margin :10}}>  
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

    renderCardMethods(){
        return <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
            <div style={{display:'flex', width:'100%', flexDirection:'row'}}>
                <CreditCard/>&nbsp;
                <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Card</Typography>
            </div>
            <div style={{display:'flex', width:'100%', flexDirection:'row', flexDirection:'row',borderBottom:'1px solid #f0f0f0', paddingBottom:'2rem'}}>
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
                    
                
                    {Math.ceil(Number(this.props.data.topayamount)).toFixed(2) ===  Number(this.props.data.topayamount).toFixed(2) &&  this.paymentController.getPaymentValues(Math.ceil(Number(this.props.data.topayamount)), 3).map(t=>{
                        return <Grid item xs={3} style={{display:'flex'}}>
                                    <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:this.state.selectedAmount === t ? '1px solid #bee1f7': '1px solid #134163', background:this.state.selectedAmount === t ? '#bee1f7' :'transparent', margin:10,borderRadius:10, cursor:'pointer'}} align="left"
                                     onClick={()=>{
                                        this.selectPayment(t)
                                    }}>{Number(t).toFixed(2)}</Typography>
                                </Grid>
                    })} 
                    
                    {Math.ceil(Number(this.props.data.topayamount)).toFixed(2) !==  Number(this.props.data.topayamount).toFixed(2) &&  this.paymentController.getPaymentValues(Math.ceil(Number(this.props.data.topayamount)), 2).map(t=>{
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
                    <ModalTitleBar onClose={()=> this.setState({cashCustomAmount:0, CashCustomPopup: false})} title="Custom Payment"/> 
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
                                                        onChange={this.handlechange}
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
                                    <Button color="secondary" fullWidth variant="outlined" onClick={() => this.setState({cashCustomAmount:0, CashCustomPopup: false})} >Cancel</Button>
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid> 
                        </Grid>
                    </Box>
                </div>
            </div> 
    }


    render(){
        return <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
            {this.renderCardMethods()}

            {this.state.notesPopup && this.renderNotes()}
            {this.state.completionPopup && this.renderCompletion()}

            {this.state.CashCustomPopup && this.renderCashCustom() }
        </div>
    }
}
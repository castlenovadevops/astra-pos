import React from 'react';   
import {Grid,  Typography, Button,Box,   InputAdornment } from '@material-ui/core/'; 
import TextField from '@mui/material/TextField'; 
import PaymentController from '../../../../controller/paymentController'; 
import ModalTitleBar from '../../../../components/Modal/Titlebar'; 
 

export default class TicketSplitPayment extends React.Component  {
    paymentController = new PaymentController();

    constructor(props){
        super(props);
        this.state={
            payamount:'',
            noofsplits:1,
            splitCustomAmount: 0,
            splitCustomPopup: false,
        } 
        this.handlesplitchange = this.handlesplitchange.bind(this)
    }

    splitAmount(n){
        this.props.data.onselectedWays(Number(this.props.data.ticketDetail.ticketPendingAmount)/n);

    }

    handlesplitchange(e){
        if((e.target.value.match( "^.{"+7+","+7+"}$")===null)) {
            // console.log(e.target.value.length)
            if(e.target.value.length>=1) {
                this.setState({isDiabled: false})
            }
            else {
                this.setState({isDiabled: true})
            }
            this.setState({splitCustomAmount: e.target.value}) 
           
          }
       
    }
    
    

    renderSplitCustom(){
        return <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container' style={{height:'250px', width:'500px'}}> 
                    <ModalTitleBar onClose={()=> this.setState({splitCustomAmount:0, splitCustomPopup: false})} title="Custom Payment"/> 
                    <Box style={{padding: 20}}>
                        <Grid container spacing={2}>    
                            <Grid container justify="center" xs={12} style={{  alignContent: 'center'}}>         
                            <TextField  
                                                        required 
                                                        type="number" 
                                                        placeholder="Enter Amount" 
                                                        value={this.state.splitCustomAmount}
                                                        name="variable_price"
                                                        color="secondary"   
                                                        variant="standard" 
                                                        style={{background: 'white'}}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        }}
                                                        onChange={this.handlesplitchange}
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
                                           this.verifySplitAmount() 
                                    }} fullWidth variant="contained" 
                                    disabled={this.state.isDiabled}>Pay</Button>
                                    <Button color="secondary" fullWidth variant="outlined" onClick={() => this.setState({splitCustomAmount:0, splitCustomPopup: false})} >Cancel</Button>
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid> 
                        </Grid>
                    </Box>
                </div>
            </div> 
    } 

    verifySplitAmount(){
        if(this.state.splitCustomAmount > this.props.data.topayamount){
            this.setState({showError:true, errorMsg:`Amount should be less than or equal to $`+ Number(this.props.data.topayamount).toFixed(2)})
        }
        else{
            this.setState({splitCustomPopup: false}, ()=>{
                this.props.data.onselectedWays(this.state.splitCustomAmount);
            });
        }
    } 

    render(){
        return <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display: 'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>  
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{"color":'#000', fontWeight:'700'}} align="left">Full Amount</Typography>
                        <Typography  id="modal-modal-title" variant="h5"  style={{"color":'#000', fontWeight:'700'}} align="left">${Number(this.props.data.ticketDetail.ticketPendingAmount).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>

                
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                    <Grid item xs={4}>
                        <Typography  onClick={()=>{
                            this.splitAmount(1);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#fff', fontWeight:'700', width:'200px', height:'70px', background:'#134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            Full Amount
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>  
                        <Typography onClick={()=>{
                            this.splitAmount(2);
                        }} id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            2 Ways
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography onClick={()=>{
                            this.splitAmount(3);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                           3 Ways
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                    <Grid item xs={4}>
                        <Typography  onClick={()=>{
                            this.splitAmount(4);
                        }} id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            4 Ways
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>  
                        <Typography  onClick={()=>{
                            this.splitAmount(5);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                            5 Ways
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography  onClick={()=>{
                            this.splitAmount(6);
                        }}  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'200px', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left">
                           6 Ways
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:10, width:'80%'}}>
                        <Typography  id="modal-modal-title" variant="subtitle"  style={{display:'flex', alignItems:'center', justifyContent:'center',"color":'#000', fontWeight:'700', width:'100%', height:'70px', border:'1px solid #134163', margin:10,borderRadius:10, cursor:'pointer'}} align="left" onClick={()=>{
                            this.setState({splitCustomPopup: true})
                        }}>
                           Custom
                        </Typography>
                </Grid>
                
            {this.state.splitCustomPopup && this.renderSplitCustom() }

        </div>
    }
}
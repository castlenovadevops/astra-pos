import React from "react";  
import Moment from 'moment';  
import { Card,  Stack, Container, TextField , Grid,IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

// //import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
// import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
 
import {Print, CalendarMonthOutlined} from '@mui/icons-material'; 
import HTTPManager from "../../utils/httpRequestManager";
import moment from 'moment';

 
import Iconify from '../../components/Iconify';
import Loader from "../../components/Loader";
const getIcon = (name) => <Iconify style={{color:'#d0d0d0', marginLeft:'5px'}} icon={name} width={22} height={22} />;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

const section = {
  height: '100%',
  marginTop: 10, 
  display:'flex', 
  justifyContent:'center', 
  alignItems:'center',  
  width:'25%'
};
export default class BatchReports extends React.Component {
    httpManager = new HTTPManager();
  constructor(props) {
    super(props);
    
      this.state={  
        merchantdetail:{},
        from_date:new Date(),
        to_date:new Date(),
        showDatePopup: false, 
        batches:[],   
        tickets:[],
        batchDetail:{},
        showDetail:false,
        printalert:false
    }
      
    this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
    this.handlechangeToDate = this.handlechangeToDate.bind(this);
    this.getBatchReports = this.getBatchReports.bind(this);
    this.getBatchTickets = this.getBatchTickets.bind(this);
    this.showBatchDetail = this.showBatchDetail.bind(this);
  }
 
    handlechangeFromDate(e){
        this.setState({from_date: e});
    }
    handlechangeToDate(e){
        this.setState({to_date: e});
    }   

    componentDidMount(){ 
        this.setState({isLoading: true})
        let detail = window.localStorage.getItem("merchantdetail");
        this.setState({merchantdetail: JSON.parse(detail)}, function(){  
                this.getBatchReports() 
        });
    }


    getBatchReports(){
        this.httpManager.postRequest(`merchant/batch/getBatches`,{from_date:this.state.from_date, to_date:this.state.to_date}).then(r=>{
            this.setState({batches: r.data, isLoading: false, showDatePopup: false})
        })
    }

    getBatchTickets(batch){
        var batchid = batch.sync_id;
        this.httpManager.postRequest(`merchant/batch/getBatchTickets`,{batchId:batchid}).then(tickets=>{
            console.log(tickets)
            this.setState({tickets: tickets.data, batchDetail: batch })
        })
    }

    showBatchDetail(t){
        this.httpManager.postRequest(`merchant/batch/getBatchTickets`,{batchId:t.batchId}).then(tickets=>{
            var obj = t;
            obj["tickets"] = tickets.data;
            console.log(obj)
            this.setState({batchDetail: obj}, ()=>{
                console.log(this.state.batchDetail)
                this.setState({showDetail: true})
            }) 
        })
    }

    renderContent(){
        return <div style={{ background: 'white',height: '100%'}}>  
            <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', flexDirection:'row', margin:10}}> 
                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}> 
                    <IconButton onClick={()=>{
                        this.setState({showDatePopup: true})
                    }}><CalendarMonthOutlined/></IconButton>
                </div>

            </div>

            <Card style={{ background: 'white',height: '90%'}}>
                <div style={{height: "100%"}}>
                    <Grid container spacing={3}  style={{height:'40px', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                            Date
                        </Grid>
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            Batch ID
                        </Grid> 
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            Batch Name
                        </Grid>
                        <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            Number of Tickets
                        </Grid> 

                        <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            
                        </Grid> 
                    </Grid>
                    {this.state.batches.length > 0 && <div style={{ width: '100%', height:  'calc(100% - 60px)',overflow: 'hidden', background: 'white'}}>
                
                        <div style={{width: '100%', height: 'calc(100% - 0px)',paddingLeft: 0,paddingTop: 0,paddingBottom: 0,overflowY:'auto', overflowX:'hidden', 
                        boxSizing: 'content-box', background: 'white'}}>
                        {this.state.batches.map(t=>{ 
                            // console.log("transactions:",t)
                            return <Grid container spacing={3}  style={{height:'80px', cursor:'pointer', width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}} >
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}} onClick={()=>{ this.showBatchDetail(t)}}> 
                                   {Moment(t.createdDate).format("MM/DD/YYYY HH:mm:ss a")}
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}} onClick={()=>{ this.showBatchDetail(t); }}> 
                                    {t.batchId}
                                </Grid> 
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}} onClick={()=>{  this.showBatchDetail(t); }}> 
                                    <b>{t.batchName}</b>
                                </Grid>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}} onClick={()=>{ this.showBatchDetail(t);}}> 
                                    <b>{t.ticketCount}</b>
                                </Grid> 
                                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', textTransform:'capitalize'}}> 
                                    {/* <Print style={{marginLeft:'1rem'}} onClick={(e)=>{
                                        e.preventDefault();
                                    }}/> */}
                                </Grid>
                            </Grid>
                        })}
                        </div>
                    </div> }
                
                    {this.state.isLoading === false && this.state.batches.length === 0 && <div>
                        <p style={{fontSize:'14px', width:'100%', textAlign:'center'}}>No batches added yet.</p>
                    </div>}
                </div>
            </Card> 
        </div>
    } 

    render() {
        return(
            <div style={{height:'100%'}}> 

                {this.state.isLoading &&  <Loader show={this.state.isLoading}></Loader>}
                
                
                <div style={{height:'100%'}}>   
                    <Grid container spacing={3}  style={{height:'calc(100% - 36px)', width:'100%', margin:0, padding: 0}}>
                            <Grid item xs={12} style={{height:'100%',width:'100%', margin:0, padding:0}}> 
                                <div  style={{height: '100%', padding:0}}>
                                    <Container maxWidth="xl" style={{margin: '0', padding:0,  height: '100%'}}>  
                                    
                                    {this.renderContent() } 
                                    </Container>
                                </div>
                            </Grid>
                    </Grid> 
                    <Dialog
                    className="custommodal"
                        open={this.state.showDatePopup}
                        onClose={()=>{
                            this.setState({showDatePopup: false, from_date: new Date(), to_date:new Date(), reporttype:'daily'})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                <div>Get Batches</div>
                                <div onClick={()=>{ 
                                     this.setState({showDatePopup: false})
                                }}>{getIcon('mdi:close')}</div>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        
                                <Grid container>
                                    
                                    <Grid item xs={12} style={{padding:'20px'}}>
                                        <form autoComplete="off" noValidate> 
                                            <Stack direction={'column'}> 
                                                <div  style={{margin:'10px 0'}}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
                                                    <DesktopDatePicker
                                                        label="From"
                                                        inputFormat="MM/dd/yyyy"
                                                        maxDate={new Date()}
                                                        style={{marginRight:'10px'}}
                                                        value={this.state.from_date}
                                                        onChange={this.handlechangeFromDate}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                                </div>
                                                <div  style={{margin:'10px 0'}}>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth 
                                                            style={{marginLeft:'10px'}}>
                                                        <DesktopDatePicker
                                                            label="To"
                                                            inputFormat="MM/dd/yyyy"
                                                            minDate={this.state.from_date}
                                                            maxDate={new Date()}
                                                            value={this.state.to_date} 
                                                            onChange={this.handlechangeToDate}
                                                            style={{marginLeft:'10px'}}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </LocalizationProvider>    
                                                </div>
                                            </Stack>
                                        </form>  
                                    </Grid> 
                                </Grid>
                        
                        </DialogContentText>
                            </DialogContent>
                        <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}>
                            <Button variant="contained" onClick={()=>{ this.getBatchReports()}}> Get Batches </Button>
                        </DialogActions>
            </Dialog>  
 
            <Dialog
                    className="batchmodal"
                        open={this.state.showDetail} 
                        onClose={()=>{
                            this.setState({showDetail: false, batchdetail:{}})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px', width:'80%', margin:'auto'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                <div></div>
                                <div onClick={()=>{ 
                                   this.setState({showDetail: false, batchdetail:{}})
                                }}>{getIcon('mdi:close')}</div>
                            </div> 
                        </DialogTitle>
                        <DialogContent style={{width:'100%', maxWidth:'100%'}}>
                        <DialogContentText style={{width:'100%', maxWidth:'100%'}} id="alert-dialog-description">
                        
                                <Grid container style={{display:'flex', flexDirection:'row'}}>
                                <Grid item xs={12}>
                                   {this.state.batchDetail.batchId !== undefined && <>
                                                    <Grid item xs={12} style={{padding:'10px',display:'flex', flexDirection:'row'}}> 
                                                            <Grid item xs={3} md={3}><b>Batch Id</b></Grid>
                                                            <Grid item xs={6} md={6}>  {this.state.batchDetail.batchId} </Grid> 
                                                    </Grid> 
                                                    <Grid item xs={12} style={{padding:'10px',display:'flex', flexDirection:'row'}}> 
                                                        <Grid item xs={3} md={3}><b>Batch Name</b></Grid>
                                                        <Grid item xs={6} md={6}>  {this.state.batchDetail.batchName} </Grid> 
                                                    </Grid>
                                                    <Grid item xs={12} style={{padding:'10px',display:'flex', flexDirection:'row'}}> 
                                                        <Grid item xs={3} md={3}><b>Batch Created Time</b></Grid>
                                                        <Grid item xs={6} md={6}>  {moment(this.state.batchDetail.created_at).format('MM/DD/YYYY HH:mm:ss a')} </Grid> 
                                                    </Grid> 
                                                    <Grid item xs={12} style={{padding:'8px',display:'flex', flexDirection:'row', background:'#ccc'}}> 
                                                            <Grid item xs={3} md={3}><b>Payment Date</b></Grid>
                                                            <Grid item xs={3} md={3}><b>Ticket Code</b></Grid>
                                                            <Grid item xs={3} md={3}><b>Amount</b></Grid>
                                                            <Grid item xs={3} md={3}><b>Payment mode</b></Grid>
                                                    </Grid>
                                            {this.state.batchDetail.tickets.map(t=>{
                                                return <>
                                                    <Grid item xs={12} style={{ display:'flex', flexDirection:'row'}}> 
                                                        <Grid item xs={3} md={3}>{moment(t.createdDate).format('MM/DD/YYYY HH:mm:ss a')} </Grid>
                                                        <Grid item xs={3} md={3}>{t.ticketCode}</Grid>
                                                        <Grid item xs={3} md={3}>${Number(t.ticketPayment).toFixed(2)}</Grid>
                                                        <Grid item xs={3} md={3} style={{textTransform:'capitalize'}}>{t.paymentType+" Card"}{t.cardType !== '' ? ' ('+t.cardType+')' : ''}</Grid>
                                                    </Grid>
                                                </>
                                            })}</> }
                                    </Grid> 
                                </Grid>
                        
                        </DialogContentText>
                            </DialogContent>
                        <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}> 
                        </DialogActions>
            </Dialog>  

                </div> 
            </div>
        )
    }
 
}
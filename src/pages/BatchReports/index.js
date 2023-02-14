import React from "react";  
import Moment from 'moment';  
import { Card,  Stack, Container, TextField , Grid,IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, FormControlLabel } from '@mui/material';
 import AutoBatchComponent from "../../autoBatch";
import { TimerOutlined } from '@mui/icons-material'
// //import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
// import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
 
import {Print, CalendarMonthOutlined} from '@mui/icons-material'; 
import HTTPManager from "../../utils/httpRequestManager";
import moment from 'moment';

 
import TimePicker from 'rc-time-picker'; 
import Iconify from '../../components/Iconify';
import Loader from "../../components/Loader";
const getIcon = (name) => <Iconify style={{color:'#000', marginLeft:'5px'}} icon={name} width={22} height={22} />;
 
const today = moment()
const format = 'hh:mm A';
const format24 = 'HH:mm';
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
        printalert:false,
        openSettings:false,
        batchTime:moment().hour(23).minute(55)
    }
      
    this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
    this.handlechangeToDate = this.handlechangeToDate.bind(this);
    this.getBatchReports = this.getBatchReports.bind(this);
    this.getBatchTickets = this.getBatchTickets.bind(this);
    this.showBatchDetail = this.showBatchDetail.bind(this);
    this.onChange = this.onChange.bind(this)
    this.saveTime = this.saveTime.bind(this)
    this.getData = this.getData.bind(this)

    this.getPrintHTML = this.getPrintHTML.bind(this)
  }

  getPrintHTML(t){
    this.httpManager.postRequest(`pos/print/getBatchPrintHTML`,{id : t.batchId}).then(htmlres=>{
            
        if(htmlres.htmlMsg instanceof Array){
            htmlres.htmlMsg.forEach(html=>{ 
                var final_printed_data = '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"></head><body>';
                final_printed_data += "<div style='max-width:280px'>"+html+"</div>";
                final_printed_data += '</body></html>';
                if(htmlres.printers.printerIdentifier !== undefined){
                // window.api.printHTML({html:html, printername:htmlres.printers.printerIdentifier}).then(r=>{console.log(htmlres.printers.printerIdentifier)
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

  saveTime(){
    this.setState({isLoading: true},()=>{
        this.httpManager.postRequest("/pos/syssettings/saveSettings", {feature:"batchsettle", value: this.state.batchTime.format(format24)}).then(res=>{
            this.getData();
            window.location.href = "/batchreports";
        })
    })
  }

  getData(){
    this.getBatchReports();
    this.setState({isLoading: true},()=>{
        this.httpManager.postRequest("pos/syssettings/getSettingsByFeature", {feature:'batchsettle', status:1}).then(res=>{
            if(res.data !== null){
                console.log(res.data)
                if(res.data.value.split(":") instanceof Array){
                    if(res.data.value.split(":").length === 2){
                        var tmp = res.data.value.split(":")
                        
                        window.localStorage.setItem('batchTime', (tmp[1]+" "+tmp[0]).trim())
                        var time = moment().hour(tmp[0]).minute(tmp[1])
                        this.setState({batchTime: time}, ()=>{
                            console.log(this.state.batchTime)
                        })
                    }
                }
            }
            this.setState({isLoading: false, openSettings: false})
        })
    })
  }

  onChange(value){
    this.setState({batchTime: value})
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
                this.getData()
        });
    }


    getBatchReports(){
        this.httpManager.postRequest(`merchant/batch/getBatches`,{from_date: Moment(this.state.from_date).format("YYYY-MM-DD"), to_date: Moment(this.state.to_date).format("YYYY-MM-DD")}).then(r=>{
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

                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}> 
                    <IconButton onClick={()=>{
                       this.setState({openSettings: true})
                    }}>{getIcon('mdi:cog')}</IconButton>
                </div>

            </div>

            <Card style={{ background: 'white',height: '90%'}}>
                <div style={{height: "100%"}}>
                    <Grid container spacing={3}  style={{height:'40px', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'12px', fontWeight:'bold'}}> 
                            Date
                        </Grid>
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px', fontWeight:'bold'}}> 
                            Batch ID
                        </Grid> 
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px', fontWeight:'bold'}}> 
                            Batch Name
                        </Grid>
                        <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px', fontWeight:'bold'}}> 
                            Number of Tickets
                        </Grid> 

                        <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px', fontWeight:'bold'}}> 
                            
                        </Grid> 
                    </Grid>
                    {this.state.batches.length > 0 && <div style={{ width: '100%', height:  'calc(100% - 60px)',overflow: 'hidden', background: 'white'}}>
                
                        <div style={{width: '100%', height: 'calc(100% - 0px)',paddingLeft: 0,paddingTop: 0,paddingBottom: 0,overflowY:'auto', overflowX:'hidden', 
                        boxSizing: 'content-box', background: 'white'}}>
                        {this.state.batches.map(t=>{ 
                            // console.log("transactions:",t)
                            return <Grid container spacing={3}  style={{height:'80px', cursor:'pointer', width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}} >
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'12px'}} onClick={()=>{ this.showBatchDetail(t)}}> 
                                   {Moment(t.createdDate).format("MM/DD/YYYY HH:mm:ss a")}
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px'}} onClick={()=>{ this.showBatchDetail(t); }}> 
                                    {t.batchId}
                                </Grid> 
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px'}} onClick={()=>{  this.showBatchDetail(t); }}> 
                                    <b>{t.batchName}</b>
                                </Grid>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px'}} onClick={()=>{ this.showBatchDetail(t);}}> 
                                    <b>{t.ticketCount}</b>
                                </Grid> 
                                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'12px', textTransform:'capitalize'}}> 
                                    <Print style={{marginLeft:'1rem'}} onClick={(e)=>{
                                        this.getPrintHTML(t)
                                        e.preventDefault();
                                    }}/>
                                </Grid>
                            </Grid>
                        })}
                        </div>
                    </div> }
                
                    {this.state.isLoading === false && this.state.batches.length === 0 && <div>
                        <p style={{fontSize:'12px', width:'100%', textAlign:'center'}}>No batches added yet.</p>
                    </div>}
                </div>
            </Card> 
        </div>
    } 

    render() {
        return(
            <div style={{height:'100%'}}> 
 <AutoBatchComponent/>
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
                                                        <Grid item xs={6} md={6}>  {Moment(this.state.batchDetail.createdDate).format("MM/DD/YYYY HH:mm:ss a")}
                                                        {/* moment(this.state.batchDetail.created_at).format('MM/DD/YYYY HH:mm:ss a') */}
                                                         </Grid> 
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


            <Dialog onClose={()=>{
                this.setState({openSettings: false})
            }} open={this.state.openSettings}>
                <DialogContent>
                    <span>Select Time:</span>
                    <TimePicker
                        showSecond={false}
                        defaultValue={this.state.batchTime} 
                        className="appt_timepicker"
                        onChange={this.onChange}
                        format={format}
                        use12Hours
                        inputReadOnly
                        inputIcon={<TimerOutlined/>}
                    /> 
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={()=>{
                            this.saveTime()
                    }} >Save</Button>
                </DialogActions>
            </Dialog>

                </div> 
            </div>
        )
    }
 
}
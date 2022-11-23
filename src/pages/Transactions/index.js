import React from "react"; 
import axios from 'axios';
import Moment from 'moment';

import { Paper,Grid,Button, Stack, Container, Typography,IconButton,TextField,DialogContentText,Dialog,DialogTitle,DialogContent,DialogActions } from '@mui/material';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
// import {CalendarViewMonthOutlined} from '@mui/icons-material';  
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {CalendarTodayOutlined as CalendarMonthIcon} from '@mui/icons-material';
import Page from '../../components/Page';
import LoaderContent from '../../components/Loader'; 

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };

// const section = {
//   height: '100%',
//   marginTop: 10, 
//   display:'flex', 
//   justifyContent:'center', 
//   alignItems:'center',  
//   width:'25%'
// };
import HTTPManager from "../../utils/httpRequestManager";

export default class Transactions extends React.Component {
    httpManager = new HTTPManager();
    constructor(props) {
        super(props);
    
        this.state={ 
            businessdetail:{}, 
            // dataManager: new DataManager(), 
            from_date:new Date(),
            to_date:new Date(),
            showDatePopup: false, 
            transactions:[],
            employeelist:[],
            selectedemps:[],
            type:'paid',
            transactiondetail:{},
            showDetail:false,
            isLoading: false,
        }
        // this.handleCloseMenu = this.handleCloseMenu.bind(this) 
        // this.handleClick = this.handleClick.bind(this);
        // this.handlePageEvent = this.handlePageEvent.bind(this); 
        // this.reloadPage = this.reloadPage.bind(this);
        this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
        this.handlechangeToDate = this.handlechangeToDate.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        
    }
    handlechangeFromDate(e){
        this.setState({from_date: e});
    }
    handlechangeToDate(e){
        this.setState({to_date: e});
    }
    handleClick(){
        // //console.log(event.target)
            this.setState({anchorEl:null, openMenu:true, editForm:false, addForm:false});
    }
    getTransactions(){  
        this.setState({isLoading: true})
        let from_date = Moment(this.state.from_date).format('YYYY-MM-DD');
        let to_date = Moment(this.state.to_date).format('YYYY-MM-DD');
        // let url = config.root+"/report/transactions"
        var input = { 
            from_date: from_date,
            to_date: to_date
        }   

        this.httpManager.postRequest(`merchant/ticket/getTransactions`, input).then(res=>{
            console.log(res.data)
            this.setState({transactions: res.data, isLoading: false})
        })
      }
    handleClickInvent(opt){
        if(opt === 'inventory')
            this.setState({expand_menu_show : !this.state.expand_menu_show});
        if(opt === 'settings')
            this.setState({setting_menu_show : !this.state.setting_menu_show});
    } 
    componentDidMount(){ 

        let detail = window.localStorage.getItem("userdetail");
        this.setState({businessdetail: JSON.parse(detail)}, function(){ 
            var condition = navigator.onLine ?  true: false;
            this.setState({isOnline: condition}, function() {
                if(!this.state.isOnline) {
                    
                }
                else { 
                    this.getTransactions()
                }
            })
            
        });

    }
    getEmpDetails() {
        var userdetail = window.localStorage.getItem('userdetail');
        if(userdetail !== undefined && userdetail !== null){
            this.setState({isLoading: true})
            axios.get(`${process.env.REACT_APP_APIURL}/employee/`+JSON.parse(userdetail).businessId).then((res)=>{
                if(res.data.data.length>0) {
                    // this.getEmp(res.data.data[0])
                    var data = res.data.data 
                    var empids = data.map(r=>r.id);
                    this.setState({isLoading: false,employeelist:data,selectedemps: empids}, function(){
                        this.getTransactions()
                    })
                } 
                else{
                    this.getTransactions()
                }
            });
        }
    }
    getEmpName(empid){
        let emp = this.state.employeelist.filter(emp=>{return emp.id === Number(empid) })
        if(emp.length>0){
            return emp[0].firstName+" "+emp[0].lastName;
        }
        else{
            return ''
        }
    }
    checkEmp(empid){
        return this.state.selectedemps.indexOf(empid) > -1 ? true : false;
    }
    
    render(){
        return(
            <Page title="Transactions | Astro POS">
                 {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
                 <Container maxWidth="xl">
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                        Transactions
                        </Typography>
                        <IconButton onClick={()=>{
                            this.setState({showDatePopup: true})
                        }}><CalendarMonthIcon/></IconButton>
                    </Stack>
                    <Stack>
                        <Paper style={{ background: 'white',height: '90%'}}>
                            {this.state.type === 'paid' && <div style={{height: "100%"}}>
                            <Grid container spacing={3}  style={{height:'40px', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                                    Date
                                </Grid>
                                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Ticket
                                </Grid>
                                {/* <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Transaction #
                                </Grid> */}
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Transaction Type
                                </Grid>
                                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Total
                                </Grid>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Payment Mode
                                </Grid>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Paid On
                                </Grid>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                                    Employee 
                                </Grid>
                            </Grid>
                        <div style={{ width: '100%', height:  'calc(100% - 0px)',overflow: 'hidden', background: 'white'}}>
                    
                        <div style={{width: '100%', height: 'calc(100% - 0px)',paddingLeft: 0,paddingTop: 0,paddingBottom: 0,overflowY:'auto', overflowX:'hidden', 
                        boxSizing: 'content-box', background: 'white'}}>
                        {this.state.transactions.map(t=>{ 
                            // console.log("transactions:",t)
                            return <Grid container spacing={3}  style={{height:'80px', cursor:'pointer', width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}} onClick={()=>{ 
                                this.setState({transactiondetail: t}, ()=>{
                                    this.setState({showDetail: true})
                                })
                            }}>
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}}> 
                                {Moment(t.created_at).format("HH:mm:ss a")}<br/>
                                <span style={{color:'#ccc'}}>{Moment(t.created_at).format("MM/DD/YYYY")}</span>
                            </Grid>
                            <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                                {t.ticket_code}
                            </Grid>
                            {/* <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                                
                            </Grid> */}
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                                <b>Payment</b>
                            </Grid>
                            <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                                <b>${Number(t.paid_amount).toFixed(2)}</b>
                            </Grid>
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', textTransform:'capitalize'}}> 
                                <b>{t.pay_mode !== null && t.pay_mode.toLowerCase() === 'cash' ? 'Cash Pay' : t.card_type}</b>
                            </Grid>
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}}> 
                                {Moment(t.paid_at).format("HH:mm:ss a")}<br/>
                                <span style={{color:'#ccc'}}>{Moment(t.paid_at).format("MM/DD/YYYY")}</span>
                            </Grid>
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', textTransform:'capitalize'}}> 
                                {this.getEmpName(t.technician_id)}
                            </Grid>
                        </Grid>
                        })}
                        </div></div>
                    
                    
                        {this.state.isLoading === false && this.state.transactions.length === 0 && <div>
                            <p style={{fontSize:'14px', width:'100%', textAlign:'center'}}>No transactions added yet.</p>
                        </div>}
                        </div>}
                        </Paper>
                        {this.state.type !== 'paid' &&<>
                            <Grid container spacing={3}  style={{height:'calc(100% - 100px)', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                                    Date
                                </Grid> 
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                                    Ticket code
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                                    Total
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                                    Employee 
                                </Grid>
                            </Grid>
                            {this.state.transactions.map(t=>{ 
                                return <Grid container spacing={3}  style={{height:'calc(100% - 100px)',background:(t.isDelete === 0 ? 'transparent': 'rgba(255,0,0,0.3)'),  width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}}>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                    {Moment(t.created_at).format("HH:mm:ss a")}<br/>
                                    <span style={{color:'#ccc'}}>{Moment(t.created_at).format("MM/DD/YYYY")}</span>
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                    {t.ticket_code}
                                </Grid> 
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                    <b>${Number(t.grand_total).toFixed(2)}</b>
                                </Grid> 
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px', textTransform:'capitalize'}}> 
                                    {this.getEmpName(t.technician_id)}
                                </Grid>
                            </Grid>
                            })}
                            </>}
                    </Stack>
                 </Container>
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
                        {/* <DialogTitle id="alert-dialog-title">
                        <ModalHeader title="Select Date" onClose={()=>{
                            this.setState({showDatePopup: false})
                        }} />
                        </DialogTitle> */}
                        <DialogTitle title="Select Date" 
                        // onClose={()=>{
                        //     this.setState({showDatePopup: false})
                        // }}
                        />
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
                                                        inputFormat="dd/MM/yyyy"
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
                                                            inputFormat="dd/MM/yyyy"
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
                            <Button variant="contained" onClick={()=>{ this.getTransactions()}} label="Get Transactions" />  
                        </DialogActions>
            </Dialog>
            <Dialog
                    className="custommodal"
                        open={this.state.showDetail} 
                        onClose={()=>{
                            this.setState({showDetail: false, transactiondetail:{}})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                        {/* <ModalHeader title="" onClose={()=>{
                            this.setState({showDetail: false, transactiondetail:{}})
                        }} /> */}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        
                                <Grid container style={{display:'flex', flexDirection:'row'}}>
                                <Grid item xs={12}>
                                   {this.state.transactiondetail.id !== undefined && <Grid item xs={12} style={{padding:'20px',display:'flex', flexDirection:'row'}}> 
                                        <Grid item xs={3} md={3}><b>Payment</b></Grid>
                                        <Grid item xs={6} md={6}> 
                                            <Grid item xs={12} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                                {Moment(this.state.transactiondetail.created_at).format("HH:mm:ss a MM/DD/YYYY")} <br/><br/>
                                               <b>Tender:</b> {this.state.transactiondetail.pay_mode.toLowerCase() === 'cash' ? this.state.transactiondetail.pay_mode : this.state.transactiondetail.card_type}<br/>
                                               <b>Ticket Code:</b> {this.state.transactiondetail.ticket_code}<br/>
                                               <b>Employee:</b> {this.getEmpName(this.state.transactiondetail.technician_id)}<br/><br/>
                                               {this.state.transactiondetail.notes && <> <b>Notes:</b><br/> {this.state.transactiondetail.notes}</> }
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={3}  md={3}>
                                            <Grid item xs={12} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                                <b>${Number(this.state.transactiondetail.grand_total).toFixed(2)}</b>
                                            </Grid> 
                                        </Grid>
                                    </Grid> }
                                    </Grid>

                                    <Grid item xs={12} style={{position:'absolute', bottom:0, left:0, right:0, borderTop:'1px solid #f0f0f0',display:'flex', flexDirection:'row', padding:10}}>

                                    <Grid item xs={9} md={9}> <h3>Total</h3></Grid>
                                    <Grid item xs={3} md={3}> <h3>${Number(this.state.transactiondetail.grand_total).toFixed(2)}</h3></Grid>

                                    </Grid>
                                </Grid>
                        
                        </DialogContentText>
                            </DialogContent>
                        <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}> 
                        </DialogActions>
            </Dialog>  

            </Page>
        )
    }
}
import React from "react"; 
import axios from 'axios';
import Moment from 'moment';

import { Paper,Grid,Button, Stack, Container, Typography,IconButton,TextField,DialogContentText,Dialog,DialogTitle,DialogContent,DialogActions } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers';
// import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
// import {CalendarViewMonthOutlined} from '@mui/icons-material';  
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {CalendarTodayOutlined as CalendarMonthIcon} from '@mui/icons-material';
import Page from '../../components/Page';
import LoaderContent from '../../components/Loader'; 

import TicketContainer from "../ticket";
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
import dayjs from "dayjs";

import socketIOClient from "socket.io-client"; 

const ENDPOINT = "http://localhost:1818";
export default class WaitingList extends React.Component {
    httpManager = new HTTPManager();
    socket = socketIOClient(ENDPOINT);
    constructor(props) {
        super(props);
    
        this.state={ 
            businessdetail:{},  
            waitinglist:[], 
            isLoading: false,
            showCreateTicket:false,
            ownerTechnician: {},
            ticketDetail:{},
        } 
        this.getWaitingList = this.getWaitingList.bind(this);
        this.convertTicket = this.convertTicket.bind(this); 
        this.setOwnerTech = this.setOwnerTech.bind(this);
        this.closeCreateTicket = this.closeCreateTicket.bind(this);
        this.editTicket = this.editTicket.bind(this)
    }  

    convertTicket(t){
        console.log("CONVETING")
        this.httpManager.postRequest(`/merchant/WaitingList/convertTicket`,{appointment:t}).then(res=>{
            this.setState({ticketDetail: res.data}, ()=>{
                this.editTicket(res.data)
            })
            this.getWaitingList();
        })
    }
    getWaitingList(){   

        this.httpManager.postRequest(`merchant/WaitingList/getAppointmentsList`, {currenttime: dayjs(new Date().toISOString()).format('HH:mm')}).then(res=>{
            console.log(res.data)
            this.setState({waitinglist: res.data, isLoading: false })
        })
      } 

    componentDidMount(){ 
        this.getWaitingList() 
    }  
    
    setOwnerTech(obj){
        this.setState({ownerTechnician: obj,ticketDetail: {}},()=>{
            this.setState({showCreateTicket: true})
        })
    }

    editTicket(detail){
        this.setState({ticketDetail: detail},()=>{
            console.log(this.state.ticketDetail)
            this.setState({showCreateTicket: true})
        })
    }
    closeCreateTicket(){ 
            this.socket.emit("refreshTickets", {data:"success"}) 
            // window.location.href="/"
        this.setState({showCreateTicket: false, ticketDetail:{}})
    }
    render(){
        return(
            <Page title="Waiting List | Astra POS">
                 {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
                   
        {this.state.showCreateTicket && <div className="createTicketContainer" ><TicketContainer ticketDetail={this.state.ticketDetail} 
        ownerTechnician={this.state.ownerTechnician} functions={{
            closeCreateTicket:this.closeCreateTicket
        }} /></div>}

                 <Container maxWidth="xl">
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                        Waiting List
                        </Typography> 
                    </Stack>
                    <Stack>
                        <Paper style={{ background: 'white',height: '90%'}}>
                              <div style={{height: "100%"}}>
                            <Grid container spacing={3}  style={{height:'40px', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                                    Date
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Customer Name
                                </Grid>
                                {/* <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Transaction #
                                </Grid> */}
                                <Grid item xs={5} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                                    Services
                                </Grid>  
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                                    Action 
                                </Grid>
                            </Grid>
                        <div style={{ width: '100%', height:  'calc(100% - 0px)',overflow: 'hidden', background: 'white'}}>
                    
                        <div style={{width: '100%', height: 'calc(100% - 0px)',paddingLeft: 0,paddingTop: 0,paddingBottom: 0,overflowY:'auto', overflowX:'hidden', 
                        boxSizing: 'content-box', background: 'white'}}>
                        {this.state.waitinglist.map(t=>{ 
                            // console.log("transactions:",t)
                            return <Grid container spacing={3}  style={{height:'80px', cursor:'pointer', width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}} >
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}}> 
                                {Moment.utc(t.appointmentDate+" "+t.appointmentTime).local().format("HH:mm:ss a")}<br/>
                                <span style={{color:'#ccc'}}>{Moment.utc(t.appointmentDate+" "+t.appointmentTime).local().format("MM/DD/YYYY")}</span>
                            </Grid>
                            <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                                {t.customerName !== '' && t.customerName !== null && t.customerName !== undefined ? t.customerName :t.guestName+"(Guest)"}
                            </Grid> 
                            <Grid item xs={5} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                               {t.appointmentServices.map(a=>{
                                    return <b>{a.mProduct.mProductName},</b>
                               })}
                            </Grid> 
                            <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', textTransform:'capitalize'}}> 
                                 <Button variant={'contained'} onClick={()=>{
                                    this.convertTicket(t);
                                 }}>Process To Ticket</Button>
                            </Grid>
                        </Grid>
                        })}
                        </div></div>
                    
                    
                        {this.state.isLoading === false && this.state.waitinglist.length === 0 && <div>
                            <p style={{fontSize:'14px', width:'100%', textAlign:'center'}}>No appointments in waiting queue.</p>
                        </div>}
                        </div> 
                        </Paper> 
                    </Stack>
                 </Container>  

            </Page>
        )
    }
}
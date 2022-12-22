import React from "react";
import {   Grid, Dialog, DialogTitle, DialogContent, DialogContentText, Button } from "@mui/material"; 
import Loader from "../../components/Loader";
import Iconify from '../../components/Iconify';
import HTTPManager from "../../utils/httpRequestManager";

import Technicians from "./technicians";
import Clockin from './clockin';
import TicketListComponent from "../ticket/list";
import TicketContainer from "../ticket";

import socketIOClient from "socket.io-client"; 

const ENDPOINT = "http://localhost:1818";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class MerchantDashboard extends React.Component{
    httpmanager = new HTTPManager(); 
    socket = socketIOClient(ENDPOINT);

    constructor(){
        super();
        this.state={
            userdetail:{},
            requestNewBusiness: false,
            isLoading: false,
            value:0,
            showClockIn: false,
            showCreateTicket:false,
            ownerTechnician: {},
            refreshData: false,
            ticketDetail:{},
            clockinemp:{}
        }
        this.loadData = this.loadData.bind(this);  
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.setOwnerTech = this.setOwnerTech.bind(this);
        this.closeCreateTicket = this.closeCreateTicket.bind(this);
        this.editTicket = this.editTicket.bind(this)
        this.setClockIn = this.setClockIn.bind(this)
    }

    setClockIn(obj){
        this.setState({clockinemp: obj},()=>{
            this.setState({showClockIn: true})
        })
    }

    editTicket(detail){
        this.setState({ticketDetail: detail},()=>{
            console.log(this.state.ticketDetail)
            this.setState({showCreateTicket: true})
        })
    }

    handleCloseDialog(){
        this.setState({showClockIn: false})
    }
    componentDidMount(){ 
        this.loadData()

        // console.log("SOCKETTTTTT")
        // console.log(this.socket)
        this.socket.on("refreshTechnicians", data => {
            // console.log("SOCKET REFRESHHHHH")
            // this.getData();
            this.setState({refreshData: true})
        });
        this.socket.on("refreshTickets", data => {
            // console.log("SOCKET REFRESHHHHH")
            // this.getData();
            this.setState({refreshData: true})
        });
    }

    loadData(){ 
        var details = window.localStorage.getItem("userdetail") || ''
        if(details !== ''){
            this.setState({userdetail: JSON.parse(details), ownerTechnician: JSON.parse(details)}, ()=>{
                // this.getBusinessMetrics();
            })
        }
    } 

    setOwnerTech(obj){
        this.setState({ownerTechnician: obj,ticketDetail: {}},()=>{
            this.setState({showCreateTicket: true})
        })
    }

    closeCreateTicket(){ 
            this.socket.emit("refreshTickets", {data:"success"}) 
            // window.location.href="/"
        this.setState({showCreateTicket: false, ticketDetail:{}})
    }

    redirectToPage(page){
        window.location.href = "/app/"+page;
    }

    render(){
        return <div className="fullHeight" >   
        {this.state.showCreateTicket && <div className="createTicketContainer" ><TicketContainer ticketDetail={this.state.ticketDetail} 
        ownerTechnician={this.state.ownerTechnician} functions={{
            closeCreateTicket:this.closeCreateTicket
        }} /></div>}
            {this.state.isLoading && <Loader />}
            <Grid container className="fullHeight">
                <Grid item xs={4} className={'dashboardDivider'}>
                    <Technicians onCompleteRefresh={()=>{// console.log("COMPLETE REFRESH CALLED");
                    this.setState({refreshData: false})}} refreshData={this.state.refreshData} setClockIn={this.setClockIn} setOwnerTech={this.setOwnerTech}/>
                </Grid>
                <Grid item xs={8} className={'dashboardDivider'}>
                   {!this.state.showCreateTicket && <TicketListComponent  data={{
                        editTicket : this.editTicket.bind(this)
                    }} onCompleteRefresh={()=>{// console.log("COMPLETE REFRESH CALLED");
                    this.setState({refreshData: false})}} refreshData={this.state.refreshData}/> }
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12} className="dashboardFooter">
                    <Grid item xs={3} className={'dashboardFooterDivider active'} onClick={()=>{
                        this.setState({showClockIn: true})
                    }}>
                        Clock-In / Clock-Out
                    </Grid>
                    <Grid item xs={3} className={'dashboardFooterDivider active'} onClick={()=>{
                        this.setState({showCreateTicket: true})
                    }}>
                        Create Ticket
                    </Grid>
                    {/* <Grid item xs={2} className={'dashboardFooterDivider '}>
                        Check-In
                    </Grid> */}
                    <Grid item xs={2} className={'dashboardFooterDivider active'}>
                        Waiting List
                    </Grid> 
                    <Grid item xs={2} className={'dashboardFooterDivider active'} onClick={()=>{
                        this.redirectToPage('appointments')
                    }}>
                        Appointments
                    </Grid>
                    <Grid item xs={2} className={'dashboardFooterDivider active'}>
                        Report
                    </Grid>
                </Grid>
            </Grid>



                <Dialog
                    open={this.state.showClockIn}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Clock-In / Clock-Out
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Clockin handleCloseDialog={()=>{
                            this.socket.emit("refreshTechnicians", {data:"success"})
                                this.setState({showClockIn: false})
                        }} clockinemp={this.state.clockinemp} />
                    </DialogContentText>
                    </DialogContent> 
                </Dialog>

        </div>
    }
}
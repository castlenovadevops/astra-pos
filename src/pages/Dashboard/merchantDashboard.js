import React from "react";
import {   Grid, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material"; 
import Loader from "../../components/Loader";
import Iconify from '../../components/Iconify';
import HTTPManager from "../../utils/httpRequestManager";

import Technicians from "./technicians";
import Clockin from './clockin';
import TicketListComponent from "../ticket/list";
import TicketContainer from "../ticket";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class MerchantDashboard extends React.Component{
    httpmanager = new HTTPManager(); 

    constructor(){
        super();
        this.state={
            userdetail:{},
            requestNewBusiness: false,
            isLoading: false,
            value:0,
            showClockIn: false,
            showCreateTicket:false,
            ownerTechnician: {}
        }
        this.loadData = this.loadData.bind(this);  
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.setOwnerTech = this.setOwnerTech.bind(this);
        this.closeCreateTicket = this.closeCreateTicket.bind(this);
    }

    handleCloseDialog(){
        this.setState({showClockIn: false})
    }
    componentDidMount(){ 
        this.loadData()
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
        this.setState({ownerTechnician: obj},()=>{
            this.setState({showCreateTicket: true})
        })
    }

    closeCreateTicket(){
        this.setState({showCreateTicket: false})
    }

    render(){
        return <div className="fullHeight" >  

        {this.state.showCreateTicket && <div className="createTicketContainer" ><TicketContainer  ownerTechnician={this.state.ownerTechnician} functions={{
            closeCreateTicket:this.closeCreateTicket
        }} /></div>}
            {this.state.isLoading && <Loader />}
           
            <Grid container className="fullHeight">
                <Grid item xs={4} className={'dashboardDivider'}>
                    <Technicians setOwnerTech={this.setOwnerTech}/>
                </Grid>
                <Grid item xs={8} className={'dashboardDivider'}>
                    <TicketListComponent/>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12} className="dashboardFooter">
                    <Grid item xs={2} className={'dashboardFooterDivider active'} onClick={()=>{
                        this.setState({showClockIn: true})
                    }}>
                        Clock-In / Clock-Out
                    </Grid>
                    <Grid item xs={2} className={'dashboardFooterDivider active'} onClick={()=>{
                        this.setState({showCreateTicket: true})
                    }}>
                        Create Ticket
                    </Grid>
                    <Grid item xs={2} className={'dashboardFooterDivider '}>
                        Check-In
                    </Grid>
                    <Grid item xs={2} className={'dashboardFooterDivider '}>
                        Waiting List
                    </Grid> 
                    <Grid item xs={2} className={'dashboardFooterDivider '}>
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
                                this.setState({showClockIn: false})
                        }} />
                    </DialogContentText>
                    </DialogContent> 
                </Dialog>

        </div>
    }
}
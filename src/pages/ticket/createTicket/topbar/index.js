import React from "react";
import { Grid, Typography, IconButton, Button } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Close from '@mui/icons-material/Close';
import DialogComponent from "../../../../components/Dialog";
import SelectTechnician from "./selectTechnician";
import SelectCustomer from "./selectCustomer";
import CustomerDetailModal from "./customerDetail";

export default class TicketTopBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            selectTechnicianPopup: false, 
            selectCustomerPopup: false,
            selectCustomerDetailPopup: false
        }

        this.onSelectTechnician = this.onSelectTechnician.bind(this);
        this.handleCloseTechnician = this.handleCloseTechnician.bind(this); 
        this.openCustomerDetail = this.openCustomerDetail.bind(this);
        this.openselectCustomer = this.openselectCustomer.bind(this);
        this.handleCloseCustomer = this.handleCloseCustomer.bind(this);
        this.onSelectCustomer = this.onSelectCustomer.bind(this); 
        this.closeCustomerDetail = this.closeCustomerDetail.bind(this)
    }

    componentDidMount(){

    }

    closeCustomerDetail(){
        this.setState({selectCustomerDetailPopup: false})
    }

    openTechnician(){
        // console.log("OPEN TECH 2")
        this.setState({selectTechnicianPopup: true})
    } 

    handleCloseTechnician(){
        this.setState({selectTechnicianPopup : false})
    }

    onSelectTechnician(obj, opt=''){ 
        // console.log("TOPBAR CALL")
        this.props.data.setTicketOwner(obj); 

        if(opt === '')
        this.setState({selectTechnicianPopup : false})
    }

    openCustomerDetail(){
        this.setState({selectCustomerDetailPopup: true})
    }

    openselectCustomer(){  
        this.setState({selectCustomerPopup : true})
    }

    onSelectCustomer(obj, opt=''){   
        this.props.data.selectCustomerDetail(obj)
        if(opt === '')
            this.setState({selectCustomerPopup : false})
    }

    
    handleCloseCustomer(){
        this.setState({selectCustomerPopup : false})
    } 
 


    render(){
        // const actionbuttons=<Button onClick={()=>{
        //     // console.log("BUTTON CLICKED")
        // }}>Click</Button>
        return  <div style={{height:'100%', width:'100%'}}>
                    <Grid className='fullHeightTicket padd20' item xs={12} spacing={2}   alignItems="baseline"> 
                        <Grid item xs={9}  style={{display:'flex'}} alignItems="center">
                                <div className={this.props.data.isDisabled ? "topbtn disabled" : "topbtn" } onClick={()=>{
                                            // console.log("OPEN TECH")
                                        if(!this.props.data.isDisabled) {
                                            this.openTechnician()
                                        }
                                    }}>
                                        {(this.props.data.selectedTech !== undefined || this.props.data.selectedTech !== null) ? this.props.data.selectedTech.mEmployeeFirstName+" "+this.props.data.selectedTech.mEmployeeLastName: ""}
                                </div>  
                                <div className={this.props.data.ticketDetail.paymentStatus === 'Paid' ? "topbtn disabled" : "topbtn" } onClick={()=>{
                                        if(!this.props.data.isDisabled) {
                                            if(this.props.data.customer_detail === null || this.props.data.customer_detail === undefined || Object.keys(this.props.data.customer_detail).length>0) {
                                                this.openCustomerDetail()
                                            }
                                            else if(this.props.data.ticketDetail.paymentStatus !== 'Paid'){
                                                console.log("OPEN CUSTOMER")
                                                this.openselectCustomer()
                                            }
                                        }
                                    }}>
                                        {this.props.data.customer_detail=== undefined ||  Object.keys(this.props.data.customer_detail).length===0 ? "Select Customer": this.props.data.customer_detail.mCustomerName}
                                </div>    
                                <AccountCircle fontSize="large" className={this.props.data.ticketDetail.paymentStatus === 'Paid' ? "accnticon disabled" : "accnticon"}  
                                onClick={()=>{
                                        if(this.props.data.ticketDetail.paymentStatus !== 'Paid') {
                                            this.openselectCustomer()
                                        }
                                        
                                }}/> 
                        </Grid>
                        
                        <Grid item xs={3} style={{display:'flex', background: 'white', justifyContent:'flex-end'}} justify="flex-end" alignItems="center"> 

                            <div style={{marginLeft: 20, fontSize: 12}}>
                                <Typography  fontSize="14"  align="center" maxWidth="90 px">
                                    TID - # {this.props.data.ticketDetail.ticketCode}
                                </Typography>
                            </div>
                            <IconButton
                                edge="end"                                
                                onClick={()=>{
                                    this.props.data.handleCloseTicket();
                                }}
                                aria-label="close"
                                style={{"color":'#8C8C8C',marginLeft: 20}}
                                >
                                <Close />
                            </IconButton>
                            
                        </Grid> 
                    </Grid>
                    
                    {/* Select technician popup */}
                    {this.state.selectTechnicianPopup &&  
                        <DialogComponent open={this.state.selectTechnicianPopup} title={'Select Technician'}  onClose={this.handleCloseTechnician} >
                              <SelectTechnician afterSubmit={()=>{this.handleCloseTechnician()}} selectedTech={this.props.data.selectedTech} onSelectTech={this.onSelectTechnician} />
                        </DialogComponent> 
                    }


                    {/*Select Customer Popup*/}
                    {this.state.selectCustomerPopup && 
                     <DialogComponent open={this.state.selectCustomerPopup} title={'Select Customer'}  onClose={this.handleCloseCustomer} >
                              
                                <SelectCustomer customerDetail={this.props.data.customer_detail} handleCloseCustomer={()=>this.handleCloseCustomer()} onSelectCustomer={(obj, opt)=>this.onSelectCustomer(obj, opt)}/>
                    </DialogComponent>}

                    {this.state.selectCustomerDetailPopup &&
                        <DialogComponent open={this.state.selectCustomerDetailPopup} onClose={this.closeCustomerDetail} >
                                <CustomerDetailModal open={this.state.selectCustomerDetail} onClose={()=>this.closeCustomerDetail()} 
                        handleClosePayment={(msg)=>this.closeCustomerDetail()} customerDetail={this.props.data.customer_detail}></CustomerDetailModal>
                        </DialogComponent> 
                    }

                </div>
    }
}
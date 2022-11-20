import React from "react";
import { Grid, Typography, IconButton, Button } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Close from '@mui/icons-material/Close';
import DialogComponent from "../../../components/Dialog";

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
        this.onSelectTechnician = this.onSelectTechnician.bind(this);
        this.openCustomerDetail = this.openCustomerDetail.bind(this);
        this.openselectCustomer = this.openselectCustomer.bind(this);
        this.handleCloseCustomer = this.handleCloseCustomer.bind(this);
        this.onSelectCustomer = this.onSelectCustomer.bind(this); 
    }

    componentDidMount(){

    }

    openTechnician(){
        this.setState({selectTechnicianPopup: true})
    } 

    handleCloseTechnician(){
        this.setState({selectTechnicianPopup : false})
    }

    onSelectTechnician(obj){ 
        this.props.setTicketOwner(obj); 
        this.setState({selectTechnicianPopup : false})
    }

    openCustomerDetail(){
        this.setState({selectCustomerDetailPopup: true})
    }

    openselectCustomer(){  
        this.setState({selectCustomerPopup : true})
    }

    onSelectCustomer(obj){  
        this.props.selectCustomerDetail(obj)
        this.setState({selectCustomerPopup : false})
    }

    
    handleCloseCustomer(){
        this.setState({selectCustomerPopup : false})
    } 
 


    render(){
        const actionbuttons=<Button onClick={()=>{
            console.log("BUTTON CLICKED")
        }}>Click</Button>
        return  <div style={{height:'100%', width:'100%'}}>
                    <Grid className='fullHeight padd20' item xs={12} spacing={2}   alignItems="baseline"> 
                        <Grid item xs={9}  style={{display:'flex'}} alignItems="center">
                                <div className={this.props.data.isDisabled ? "topbtn disabled" : "topbtn" } onClick={()=>{
                                        if(!this.props.data.isDisabled) {
                                            this.openTechnician()
                                        }
                                    }}>
                                        {(this.props.data.selectedTech !== undefined || this.props.data.selectedTech !== null) ? this.props.data.selectedTech.firstName+" "+this.props.data.selectedTech.lastName: ""}
                                </div>  
                                <div className={this.props.data.isDisabled ? "topbtn disabled" : "topbtn" } onClick={()=>{
                                        if(!this.props.data.isDisabled) {
                                            if(Object.keys(this.props.customer_detail).length>0) {
                                                this.openCustomerDetail()
                                            }
                                            else {
                                                this.openselectCustomer()
                                            }
                                        }
                                    }}>
                                        {Object.keys(this.props.data.customer_detail).length===0 ? "Select Customer": this.props.data.customer_detail.name}
                                </div>    
                                <AccountCircle fontSize="large" className={this.props.isDisabled ? "accnticon disabled" : "accnticon"}  
                                onClick={()=>{
                                        if(!this.props.data.isDisabled) {
                                            this.openselectCustomer()
                                        }
                                        
                                }}/> 
                        </Grid>
                        
                        <Grid item xs={3} style={{display:'flex', background: 'white'}} justify="flex-end" alignItems="center"> 

                            <div style={{marginLeft: 20, fontSize: 12}}>
                                <Typography  fontSize="14"  align="center" maxWidth="90 px">
                                    TID - # {this.props.data.ticketDetail.ticketCode}
                                </Typography>
                            </div>
                            <IconButton
                                edge="end"                                
                                onClick={()=>{
                                    this.props.handleCloseTicket();
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
                        <DialogComponent open={this.state.selectTechnicianPopup} onClose={this.handleCloseTechnician} actions={actionbuttons}>
                                <div>TECH POPIUUPP</div>
                        </DialogComponent>
                        // <SelectTechnician afterSubmit={()=>{this.handleCloseTechnician()}} onSelectTech={this.onSelectTechnician} technician={this.props.technicianList}/>
                    }


                    {/*Select Customer Popup*/}
                    {/* {this.state.selectCustomerPopup && 
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container xl_modal'> 
                                <ModalTitleBar onClose={()=>this.handleCloseCustomer()} title="Select Customer"/>  
                                <SelectCustomer customerDetail={this.props.customer_detail} handleCloseCustomer={()=>this.handleCloseCustomer()} onSelectCustomer={(obj)=>this.onSelectCustomer(obj)}/>
                            </div>
                        </div>} */}



                </div>
    }
}
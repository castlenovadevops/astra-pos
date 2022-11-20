import React from "react"; 
import {Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import TicketTopBar from "./createTicket/topbar";
import HTTPManager from "../../utils/httpRequestManager";

export default class TicketListComponent extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            userdetail:{}, 
            isLoading: false, 
            ticketDetail:{},
            showError: false,
            error: false,
            selectedTech: {},
            customer_detail:{}
        }  
    } 

    componentDidMount(){
        if(this.props.data.ticketDetail !== undefined){

        }
        else{
            this.httpManager.postRequest("merchant/ticket/getTicketcode",{data:"REQUEST TICKET CODE"}).then(res=>{
                this.setState({ticketDetail: res.ticket})
            }).catch(e=>{
                this.setState({error: e.message}, ()=>{
                    this.setState({showError: true})
                })
            })
        }

        if(this.props.data.ownerTechnician !== undefined){
            this.setState({selectedTech: this.props.data.ownerTechnician, customer_detail: this.props.data.customer_detail}, ()=>{
                console.log(this.state.selectedTech)
            })
        }
    }

    render(){
        return  <Grid container className='fullWidth fullHeight'>
                    <Grid item xs={12}  className='fullWidth fullHeight'>
                            <Grid item xs={12} style={{height:'100px', background:'red'}} className='fullWidth'>
                               {this.state.selectedTech.mEmployeeId !== undefined && <TicketTopBar data={{
                                    selectedTech:this.state.selectedTech,
                                    customer_detail:this.state.customer_detail,
                                    ticketDetail: this.state.ticketDetail,
                                    isDisabled: false
                                }}/>}
                            </Grid>
                            <Grid item xs={12} style={{height:'calc(100% - 100px)', background:'blue'}} className='fullWidth'>
                                <Grid item xs={8} className='fullHeight'>
                                    <Grid item xs={12} style={{height:'calc(100% - 300px)', background:'blue'}} className='fullWidth'>

                                    </Grid>
                                    <Grid item xs={12} style={{height:'200px', background:'gray'}} className='fullWidth'>

                                    </Grid>

                                    <Grid item xs={12} style={{height:'100px', background:'green'}} className='fullWidth'>

                                    </Grid>
                                </Grid>
                                <Grid item xs={4} className='fullHeight'>

                                </Grid>
                            </Grid>
                    </Grid>


                <Dialog
                    open={this.state.showError}
                    onClose={
                        this.setState({error: ""}, ()=>{
                            this.setState({showError: false})
                        })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.error}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>{
                           this.setState({showError: false, error:''})
                        }}>OK </Button> 
                    </DialogActions>
                </Dialog>
            </Grid> 
    }
}
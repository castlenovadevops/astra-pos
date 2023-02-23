/* eslint-disable no-useless-constructor */
import React from "react";
import {Typography, Button} from '@mui/material';
import { Print } from "@mui/icons-material";
import TableView from "../../components/table/closedTableView";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from "@mui/material";
import * as Moment from 'moment';
import HTTPManager from "../../utils/httpRequestManager";
import Loader from "../../components/Loader";
 
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers'; 
import Iconify from '../../components/Iconify';
const getIcon = (name) => <Iconify style={{color:'#d0d0d0', marginLeft:'5px'}} icon={name} width={22} height={22} />;

export default class ClosedTicketsComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state = {
            showConfirm: false,
            showDatePopup: false,
            from_date: new Date(),
            to_date : new Date(),
            batchConfirm: false,
            columns: [

                {
                    field: 'ticket_code',
                    headerName: 'Ticket Code',
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                        <Typography variant="body2" 
                        style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                            {params.row.ticketCode}</Typography>

                    )
                },
                {
                    field: 'customer_id',
                    headerName: 'Customer Name',
                    flex: 1,
                
                    editable: false,
                    renderCell: (params) => (
                        <Typography variant="body2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {params.row.mCustomer !== null && params.row.mCustomer.mCustomerName !== '' ? params.row.mCustomer.mCustomerName : 'NA'}
                        </Typography>
                    )
                },
                {
                    field: 'price',
                    headerName: 'Price',
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    
                        <Typography variant="body2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {params.row.ticketTotalAmount !== null ? "$"+ Number(params.row.ticketTotalAmount.toString()).toFixed(2) : 'NA'}
                        </Typography>
                    )
                },
                
                {
                    field: 'created_at',
                    headerName: 'Time',
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                            <Typography variant="body2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                        */}  
                        {Moment.parseZone(params.row.lastPaidTicket).format('MM-DD-YYYY hh:mm a')}

                        {/* {params.row.created_at} */}
                        
                        </Typography>
                    )
                },
                {
                    field: 'payment',
                    headerName: 'Payment Mode',
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    
                    <div style={{"float":"right", display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {/* {(params.row.paymentStatus !== 'Paid')&&
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className='bgbtn'
                            style={{ marginLeft: 16 }}
                            onClick={(event) => {
                                // event.nativeEvent.stopPropagation()
                                this.handleTicketPayment(params.row)
                                //console.log("payment")
                            }}
                        >
                            Pay
                        </Button>} */} 
                        {(params.row.paymentStatus === 'Paid') && <b style={{textTransform:'capitalize', display:'flex', alignItems:'center', textOverflow:'ellipsis', height:'50px', overflow:'hidden'}}>{params.row.paymode}</b>}
                        {/* <Print style={{marginLeft:'1rem'}} onClick={()=>this.handleTicketPrint(params.row)}/> */}
                    </div>
                    )
                },
            ],
            ticketslist:[],
            isLoading: false,
            refreshData: false
        }

        this.handleTicketPrint = this.handleTicketPrint.bind(this)
        this.handleTicketPayment = this.handleTicketPayment.bind(this)
        this.onSubmitBatchSettle  = this.onSubmitBatchSettle.bind(this)
        this.loadClosedTicketsToBatch = this.loadClosedTicketsToBatch.bind(this)
        this.checkBatch= this.checkBatch.bind(this)
        this.openClosedDatePopup = this.openClosedDatePopup.bind(this)
        this.onCloseDialog = this.onCloseDialog.bind(this)
    }

    onCloseDialog(){
        this.setState({batchConfirm: false, batcherror: false })
    }

    openClosedDatePopup(){
        this.setState({showDatePopup: true})
    }

    checkBatch(){  
        this.httpManager.postRequest('merchant/ticket/getOpenTickets',{data:"FORM DASHBOARD"}).then(res=>{ 
            console.log(res.data.length)
            if(res.data.length > 0){
                this.setState({showConfirm: true})
            }
            else{
                this.loadClosedTicketsToBatch()
            }
        })
    }



    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.refreshData !== prevState.refreshData){
            return {refreshData: nextProps.refreshData}
        }
        return null;
      }

    handleTicketPayment(){

    }

    handleTicketPrint(){

    }

    componentDidMount(){
        this.loadData();
    }

    loadData(){
        this.setState({isLoading: true})
        console.log(this.state.from_date, this.state.to_date)
        this.httpManager.postRequest('merchant/ticket/getPaidTickets',{from_date: Moment(this.state.from_date).format("YYYY-MM-DD"), to_date: Moment(this.state.to_date).format("YYYY-MM-DD")}).then(res=>{ 
            this.setState({isLoading: false, ticketslist: res.data, showDatePopup: false})
            console.log(res.data)
        })
    }

    loadClosedTicketsToBatch(){
        this.setState({isLoading: true, showConfirm: false})
        this.httpManager.postRequest('merchant/ticket/getClosedTicketsToBatch',{from_date: Moment(this.state.from_date).format("YYYY-MM-DD"), to_date: Moment(this.state.to_date).format("YYYY-MM-DD")}).then(res=>{ 
            this.setState({isLoading: false})
            if(res.data.length === 0){
                this.setState({batcherror: true})
            }
            else{
                this.setState({batchConfirm: true})
            }
            console.log(res.data)
        })
    }



    onSubmitBatchSettle(){ 
        this.setState({isLoading: true, batchConfirm: false})
        this.httpManager.postRequest('merchant/batch/save',{from_date: this.state.from_date, to_date: this.state.to_date}).then(res=>{ 
            this.setState({isLoading: false,})
        });
    }

    render(){
        return <>
        {this.state.refreshData && this.loadData()}
            {this.state.isLoading && <Loader />}
            <Dialog
                    open={this.state.showConfirm}
                    onClose={()=>{
                        this.setState({showConfirm: false})
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmation
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Some tickets are not closed. Are you sure to continue?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button  size="large" variant="contained"  onClick={()=>this.loadClosedTicketsToBatch()}>Yes</Button>
                        <Button size="large" variant="contained"  onClick={()=>this.setState({showConfirm: false})}>No</Button>
                    </DialogActions>
                </Dialog> 

                <Dialog
                    open={this.state.batcherror}
                    onClose={this.onCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        There are no closed tickets to batch.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions> 
                        <Button  size="large" variant="contained"  onClick={()=>this.setState({batcherror: false})}>OK</Button>
                    </DialogActions>
                </Dialog> 



                <Dialog
                    open={this.state.batchConfirm}
                    onClose={this.onCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmation
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure to settle the batch?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions> 
                        <Button  size="large" variant="contained"  onClick={()=>{
                            this.onSubmitBatchSettle()
                        }}>Yes</Button>
                        
                        <Button  size="large" variant="outlined"  onClick={()=>{
                            this.onCloseDialog()
                        }}>No</Button>
                    </DialogActions>
                </Dialog> 


            <Dialog
                    className="custommodal"
                        open={this.state.showDatePopup}
                        onClose={()=>{
                            this.setState({showDatePopup: false, from_date: new Date(), to_date:new Date()})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                <div>Get Closed Tickets</div>
                                <div onClick={()=>{ 
                                     this.setState({showDatePopup: false, from_date: new Date(), to_date:new Date()})
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
                                                        onChange={(e)=>{
                                                            console.log(e)
                                                            this.setState({from_date: e});
                                                        }}
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
                                                            onChange={(e)=>{
                                                                this.setState({to_date: e});
                                                            }}
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
                            <Button variant="contained" onClick={()=>{ this.loadData()}}> Get Tickets </Button> 
                        </DialogActions>
            </Dialog>
                
            {/* <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div> </div>
                <div style={{display:'flex', alignItems:'center', marginBottom:'1rem'}}>
                    <div>
                        <Button variant={'contained'} color={'primary'} onClick={()=>{
                            this.httpManager.postRequest('merchant/ticket/getOpenTickets',{data:"FORM DASHBOARD"}).then(res=>{ 
                                console.log(res.data.length)
                                if(res.data.length > 0){
                                    this.setState({showConfirm: true})
                                }
                                else{
                                    this.loadClosedTicketsToBatch()
                                }
                            })
                        }}>Batch Settle</Button>
                    </div>
                    <div onClick={()=>{
                        this.setState({showDatePopup: true})
                    }}>{getIcon('mdi:calendar-check')}</div>
                </div>
            </div> */}
            <TableView columns={this.state.columns} tblFunctions={{
                checkBatch: this.checkBatch,
                openClosedDatePopup: this.openClosedDatePopup
            }} data={this.state.ticketslist} onRowClick={(params)=>{
                console.log(params)
                this.props.data.editTicket(params.row)
            }}/>
        </>
    }
}
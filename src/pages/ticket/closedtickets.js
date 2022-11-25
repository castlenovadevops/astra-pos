/* eslint-disable no-useless-constructor */
import React from "react";
import {Typography, Button} from '@material-ui/core';
import { Print } from "@mui/icons-material";
import TableView from "../../components/table/tableView";
import * as Moment from 'moment';
import HTTPManager from "../../utils/httpRequestManager";
import Loader from "../../components/Loader";
export default class ClosedTicketsComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state = {
            columns: [

                {
                    field: 'ticket_code',
                    headerName: 'Ticket Code',
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                        <Typography variant="subtitle2" 
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
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
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
                    
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
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
                            <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                        */} 
                        {Moment.utc(params.row.createdDate).local().format('MM-DD-YYYY hh:mm a')}

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
                        {(params.row.paymentStatus === 'paid') && <b style={{textTransform:'capitalize'}}>{params.row.pay_mode}</b>}
                        <Print style={{marginLeft:'1rem'}} onClick={()=>this.handleTicketPrint(params.row)}/>
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
    }




    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.refreshData !== prevState.refreshData){
            return {refreshData: nextProps.refreshData}
        }
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
        this.httpManager.postRequest('merchant/ticket/getPaidTickets',{data:"FORM DASHBOARD"}).then(res=>{ 
            this.setState({isLoading: false, ticketslist: res.data})
            console.log(res.data)
        })
    }

    render(){
        return <>
        {this.state.refreshData && this.loadData()}
            {this.state.isLoading && <Loader />}
            <TableView columns={this.state.columns} data={this.state.ticketslist} onRowClick={(params)=>{
                console.log(params)
                this.props.data.editTicket(params.row)
            }}/>
        </>
    }
}
/* eslint-disable no-useless-constructor */
import React from "react";
import {Typography, Button} from '@material-ui/core';
import { Print } from "@mui/icons-material";
import TableView from "../../components/table/tableView";
import * as Moment from 'moment';
import HTTPManager from "../../utils/httpRequestManager";
import Loader from "../../components/Loader";
import PaymentModal from "./createTicket/footer/TicketPayment";
import PrintModal from "./createTicket/footer/TicketPrint";

export default class OpenTicketsComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state = {
            openPayment: false,
            price:{},
            ticketDetail:{},
            openPrint: false,
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
                        {Moment.utc(params.row.createdDate.replace("T"," ").replace("Z","")).local().format('MM-DD-YYYY hh:mm a')}

                        {/* {params.row.created_at} */}
                        
                        </Typography>
                    )
                },
                {
                    field: 'payment',
                    headerName: '',
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    
                    <div style={{"float":"right", display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {(params.row.paymentStatus !== 'Paid')&&
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className='bgbtn'
                            style={{ marginLeft: 16 }}
                            onClick={(event) => { 
                                this.handleTicketPayment(params.row);
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        >
                            Pay
                        </Button>}
                        {/* {(params.row.paymentStatus === 'paid') && <b style={{textTransform:'capitalize'}}>{params.row.pay_mode}</b>} */}
                        <Print style={{marginLeft:'1rem'}} onClick={(event)=>{
                            this.handleTicketPrint(params.row);
                            event.preventDefault();
                            event.stopPropagation();
                        }}/>
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
        return null;
    }

    handleTicketPayment(row){ 
        
        var total = 0;
        var values = row.ticketdiscounts.map(r=>r.mDiscountAmount)
        var price = { 
            ticketSubTotal:row.serviceAmount,
            ticketDiscount:total,
            taxAmount:row.taxAmount,
            tipsAmount:row.tipsAmount,
            grandTotal:row.ticketTotalAmount
        }
        this.setState({price:price, ticketDetail: row}, ()=>{
            console.log(this.state.price)
            this.setState({openPayment: true})
        })
        values.forEach(e=>{
            total = Number(total)+Number(e);
            price.ticketDiscount = total;
            this.setState({price: price})
        })
    }

    handleTicketPrint(row){
        var total = 0;
        var values = row.ticketdiscounts.map(r=>r.mDiscountAmount)
        var price = { 
            ticketSubTotal:row.serviceAmount,
            ticketDiscount:total,
            taxAmount:row.taxAmount,
            tipsAmount:row.tipsAmount,
            grandTotal:row.ticketTotalAmount
        }
        this.setState({price:price, ticketDetail: row}, ()=>{
            console.log(this.state.price)
            this.setState({openPrint: true})
        })
        values.forEach(e=>{
            total = Number(total)+Number(e);
            price.ticketDiscount = total;
            this.setState({price: price})
        })

    }

    componentDidMount(){
        this.loadData();
    }

    loadData(){
        this.setState({isLoading: true})
        this.httpManager.postRequest('merchant/ticket/getOpenTickets',{data:"FORM DASHBOARD"}).then(res=>{ 
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


{this.state.openPrint && <PrintModal customer_detail={this.state.ticketDetail.mCustomer=== null ? {}: this.state.ticketDetail.mCustomer} handleClosePayment={(msg)=>{
    this.setState({openPrint: false})
}} price={this.state.price} ticketDetail={this.state.ticketDetail}> 
            </PrintModal>}

            {this.state.openPayment && <PaymentModal pageFrom={"Dashboard"}  customer_detail={this.state.ticketDetail.mCustomer=== null ? {}: this.state.ticketDetail.mCustomer} 
                handleClosePayment={(msg)=>{
                    this.setState({openPayment: false})
                }} price={this.state.price} ticketDetail={this.state.ticketDetail}> 
            </PaymentModal>}
        </>
    }
}
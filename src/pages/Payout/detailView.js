import React from 'react'; 
import { Stack, Container, Typography, Grid } from '@mui/material';
// import TableContent from '../../components/DataGrid';
// import Moment from 'moment';

export default class ReportView extends React.Component  {
    constructor(props){
        super(props);
        this.state={
            commission:{},
            selected_emp:{},
            from_date:new Date(),
            to_date:new Date(),
            ticket_details:[],
            columns:[
                {
                    field: 'ticket_date',
                    headerName: 'Date',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.ticket_date}
                    </div>
                    )
                },
                {
                    field: 'Amount',
                    headerName: 'Amount',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {Number(params.row.Amount).toFixed(2)}
                    </div>
                    )
                },
                {
                    field: 'Tips',
                    headerName: 'Tips',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div> 
                         {Number(params.row.Tips).toFixed(2)} 
                    </div>
                    )
                },
                {
                    field: 'Discount',
                    headerName: 'Discount',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ {Number(params.row.Discount).toFixed(2)}
                    </div>
                    )
                }, 
            ]
        }
    }
    componentDidMount(){
        //console.log(this.props.empSelected);
        if(this.props.empSelected !== undefined){
            // this.setState({selected_emp: this.props.empSelected});
            // this.setState({commission:this.props.commission, selected_emp: this.props.empSelected, ticket_details: this.props.ticketslist, from_date: this.props.from_date, to_date: this.props.to_date}, function() {
            //     console.log(this.state.selected_emp)
            //     // this.getEmpTicket(this.state.selected_emp.id);
            //     // console.log(this.state.ticket_details)
            // });

            this.getEmployeeTickets();
        }
    }

    getEmployeeTickets(){

    }
    // getEmpTicket(empId){
    //     axios.get(`${process.env.REACT_APP_APIURL}/employee_commission/ticketlist/`+empId).then((res)=>{ 
    //         var status = res.data["status"];
    //         var data = res.data["data"];
    //         if(status === 200){
    //             if(data.length > 0){
    //                 this.setState({ticket_details:res.data.data});
    //             }
    //         }
            
    //     })
    // }
    render(){

        var totalpayable = (Number(this.props.empSelected.ServiceAmount)) - this.props.empSelected.Discount;

        return (
            <div style={{height: '100%'}}>
                <Container maxWidth="xl" style={{width: "100%", height: '100%'}}>
                    <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5} style={{ marginTop: 0, marginBottom:0}}>
                        
                    <Typography variant="title" gutterBottom> <b>{this.props.empSelected.businessName}</b></Typography>
                        <Typography variant="subtitle2" gutterBottom><b>Salary Report</b></Typography>
                        <Typography variant="subtitle2" gutterBottom> {this.props.from_date.toISOString().substring(0,10).replace(/-/g,"/")} - {this.props.to_date.toISOString().substring(0,10).replace(/-/g,"/")}</Typography>
                         <Typography variant="subtitle2" gutterBottom>Employee: <b> {this.props.empSelected.mEmployeeFirstName+" "+this.props.empSelected.mEmployeeLastName} </b></Typography>
                       {/* <Typography variant="subtitle2" gutterBottom>Total Tips: $ {this.state.selected_emp.total_tips}</Typography> */}

                    </Stack>

                    <Stack style={{height: '80%'}}>
                    {/* <Grid container>
                        <Grid item xs={3}><b>Date</b></Grid> 
                        <Grid item xs={3}><b>Amount</b></Grid>
                        <Grid item xs={3}><b>Tip</b></Grid>
                        <Grid item xs={3}><b>Discount</b></Grid> 
                    </Grid>
                    {this.state.ticket_details.map(elmt=>{
                        return <>
                            <Grid container>
                                <Grid item xs={3}>
                                    <b>{elmt.ticket_date}</b>
                                </Grid> 
                                <Grid item xs={3}>{Number(elmt.Amount).toFixed(2)}</Grid>
                                <Grid item xs={3}>{Number(elmt.Tips).toFixed(2)}</Grid>
                                <Grid item xs={3}>{Number(elmt.Discount).toFixed(2)}</Grid> 
                            </Grid>
                        </>
                    })}  */}

                    <Grid container style={{margin:'1rem 0'}}>
                        <Grid item xs={6}><b>Payroll</b></Grid>
                        <Grid item xs={6}><b></b></Grid>
                    </Grid>

                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}> Amount</Grid>
                        <Grid item xs={6}><b>${Number(this.props.empSelected.TotalServiceAmount).toFixed(2)}</b></Grid>
                    </Grid>

                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}>Supply</Grid>
                        <Grid item xs={6}><b>$0.00</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}> Commission({this.props.empSelected.mEmployeePercentage}%) </Grid>
                        <Grid item xs={6}><b>${(Number(this.props.empSelected.ServiceAmount)).toFixed(2)}</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}> Discounts </Grid>
                        <Grid item xs={6}><b>${(Number(this.props.empSelected.Discount)+Number(this.props.empSelected.TicketDiscount)).toFixed(2)}</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}> Tips </Grid>
                        <Grid item xs={6}><b>${Number(this.props.empSelected.Tips).toFixed(2)}</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}><b>Total</b></Grid>
                        <Grid item xs={6}><b>${Number(totalpayable).toFixed(2)}</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}><b>Cash({this.props.empSelected.mCashPercentage+"%"})</b></Grid>
                        <Grid item xs={6}><b>${Number(totalpayable * (this.props.empSelected.mCashPercentage / 100)).toFixed(2)}</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}><b>Check({this.props.empSelected.mCheckPercentage+"%"})</b></Grid>
                        <Grid item xs={6}><b>${Number(totalpayable * (this.props.empSelected.mCheckPercentage / 100)).toFixed(2)}</b></Grid>
                    </Grid>

                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}><b>Tips Cash({this.props.empSelected.mTipsCashPercentage+"%"})</b></Grid>
                        <Grid item xs={6}><b>${Number(this.props.empSelected.Tips * (this.props.empSelected.mCashPercentage / 100)).toFixed(2)}</b></Grid>
                    </Grid>
                    <Grid container style={{margin:'0.5rem 0'}}>
                        <Grid item xs={6}><b>Tips Check({this.props.empSelected.mTipsCheckPercentage+"%"})</b></Grid>
                        <Grid item xs={6}><b>${Number(this.props.empSelected.Tips * (this.props.empSelected.mTipsCheckPercentage / 100)).toFixed(2)}</b></Grid>
                    </Grid>

                    </Stack>
                    
                </Container>
            </div>
        )
    }
}
// import { filter } from 'lodash';
import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers'; 
import Page from '../../components/Page';
import AutoBatchComponent from '../../autoBatch';
import Moment from 'moment';
// material
import { Button, Card, Stack, Container,TextField, Typography,Dialog,DialogTitle,DialogContent } from '@mui/material';
import TableContent from '../../components/table/tableView';
import ReportView from './detailView';
import LoaderContent from '../../components/Loader';
 import HTTPManager from '../../utils/httpRequestManager';

export default class PayoutComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props) {
        super(props);
         this.state = {
            employee_reportlist:[],
            isEmpSelected:false,
            empSelected:{},
            openModal: false,
            selectedEmp:{},
            columns:[
                {
                    field: 'mEmployeeFirstName',
                    headerName: 'Employee',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.mEmployeeFirstName} {params.row.mEmployeeLastName}
                    </div>
                    )
                },
                {
                    field: 'mEmployeeRoleName',
                    headerName: 'Role',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                         {params.row.mEmployeeRoleName} 
                    </div>
                    )
                },
                {
                    field: 'totalservice_price',
                    headerName: 'Total Service Price',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ { Number(params.row.ServiceAmount).toFixed(2)}
                    </div>
                    )
                },
                {
                    field: 'total_tips',
                    headerName: 'Total Tips',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ { Number(params.row.Tips).toFixed(2)} 
                    </div>
                    )
                },
                {
                    field: 'total_discount',
                    headerName: 'Total Discount',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $  { (Number(params.row.Discount)+Number(params.row.TicketDiscount)).toFixed(2)}  
                    </div>
                    )
                },
                {
                    field: 'Action',
                    headerName:'Action',
                    minWidth:200,
                    renderCell: (params) => (
                    <strong>    
                        {
                        <Button permission_id = "web_view_salary" permission_label="Show view salary"
                        variant="contained" 
                        size="small" 
                        onClick={()=>this.openReport(params.row)} 
                        label="View">View</Button> 
                        }    
                           
                    
                    </strong>
                    ),
                }
                ],
            from_date:new Date(),
            to_date:new Date(),
         }

         this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
         this.handlechangeToDate = this.handlechangeToDate.bind(this);
         this.submiteReport = this.submiteReport.bind(this)
         this.openReport = this.openReport.bind(this)
         this.handleCloseReport = this.handleCloseReport.bind(this)
    }

    handleCloseReport(){
        this.setState({openModal: false, empSelected:{}, isEmpSelected: false})
    }

    openReport(row){
        this.setState({empSelected: row, isEmpSelected: true},()=>{
            this.setState({openModal: true})
        })
    }

    handlechangeFromDate(e){
        this.setState({from_date: e});
    }
    handlechangeToDate(e){
        this.setState({to_date: e});
    }
    submiteReport() {
        this.getPayout();        
    }


    componentDidMount(){
        this.getPayout()
    }

    getPayout(){
        console.log( Moment(this.state.from_date).format("YYYY-MM-DD"),  Moment(this.state.to_date).format("YYYY-MM-DD"))
        this.httpManager.postRequest('merchant/payout/getPayout', {from_date:  Moment(this.state.from_date).format("YYYY-MM-DD"), to_date:  Moment(this.state.to_date).format("YYYY-MM-DD")}).then(res=>{
            console.log(res.data)
            this.setState({employee_reportlist: res.data})
        })
    }   

    render(){
        return(
            <Page title="Payout | Astro POS">
                <AutoBatchComponent/> 
                {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
                <Container maxWidth="xl">
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Employee Payout
                    </Typography>
                    </Stack>
                    <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="From"
                                    inputFormat="MM/dd/yyyy"
                                    
                                    maxDate={new Date()}
                                    value={this.state.from_date}
                                    onChange={this.handlechangeFromDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="To"
                                    inputFormat="MM/dd/yyyy"
                                    minDate={this.state.from_date}
                                    maxDate={new Date()}
                                    value={this.state.to_date}
                                    onChange={this.handlechangeToDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Button permission_id = "web_get_salary" permission_label="Show get salary"
                            size="large" 
                            variant="contained" 
                            label="Submit" 
                            onClick={()=>this.submiteReport()}>Submit</Button>
                        </Stack>
                    </Stack>
                    <Card sx={{mt:2}}  style={{height: '80%'}}>
                        <TableContent permission_id = "web_list_salary" permission_label="Show list salary"
                        style={{height: '100%'}} 
                        data={this.state.employee_reportlist} 
                        columns={this.state.columns} />
                    </Card> 
                </Container>

                {this.state.isEmpSelected && <div>
                    <Dialog open={this.state.openModal} onClose={()=>this.handleCloseReport()} fullWidth maxWidth='md'>
                        <DialogTitle id="alert-dialog-title"> 
                        </DialogTitle>
                        <DialogContent>
                            <div style={{height:'600px' }}>
                                <ReportView   empSelected={this.state.empSelected}  from_date={this.state.from_date} to_date={this.state.to_date}/>
                            </div>
                        </DialogContent>
                    </Dialog> 
                </div>}

            </Page>
        )
    }
}
 
// import { filter } from 'lodash';
import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers'; 
import Page from '../../components/Page';

// material
import { Button, Card, Stack, Container,TextField, Typography,Dialog,DialogTitle,DialogContent } from '@mui/material';
import TableContent from '../../components/table/tableView';
// import ReportView from './detailView';
import LoaderContent from '../../components/Loader';
 import HTTPManager from '../../utils/httpRequestManager';

export default class PayoutComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props) {
        super(props);
         this.state = {
            employee_reportlist:[],
            columns:[
                {
                    field: 'mEmployeeFirstName',
                    headerName: 'Employee',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.firstName} {params.row.lastName}
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
                        $  { Number(params.row.Discount).toFixed(2)}  
                    </div>
                    )
                },
                {
                    field: 'Action',
                    headerName:'Action',
                    minWidth:200,
                    renderCell: (params) => (
                    <strong>    
                        {/* {
                        <Button permission_id = "web_view_salary" permission_label="Show view salary"
                        variant="contained" 
                        size="small" 
                        onClick={()=>this.openReport(params.row)} 
                        label="View"/> 
                        }     */}
                           
                    
                    </strong>
                    ),
                }
                ],
            from_date:new Date(),
            to_date:new Date(),
         }
    }

    componentDidMount(){
        this.getPayout()
    }

    getPayout(){
        this.httpManager.postRequest('merchant/payout/getPayout', {from_date: this.state.from_date, to_date: this.state.to_date}).then(res=>{
            console.log(res.data)
            this.setState({employee_reportlist: res.data})
        })
    }   

    render(){
        return <></>
    }
}

// export default class EmployeeSalary extends React.Component {
//     constructor(props) {
//         super(props);
//          this.state = {
//              businessdetail:{},
//               employee_reportlist:[],
//               isEmpSelected: false,
//               handleCloseReport: false,
//               isLoading: false,
//               selectedEmp:{},
//               openModal: false,
//               ticketslist:[],
//               columns:[
//                 {
//                     field: 'firstName',
//                     headerName: 'Employee',
//                     minWidth: 200,
//                     editable: false,
//                     renderCell: (params) => (
//                     <div>
//                         {params.row.firstName} {params.row.lastName}
//                     </div>
//                     )
//                 },
//                 {
//                     field: 'staff_role',
//                     headerName: 'Role',
//                     minWidth: 100,
//                     editable: false,
//                     renderCell: (params) => (
//                     <div>
//                          {params.row.staff_role !== null ? params.row.staff_role !== '' ? params.row.staff_role : '--' : '--'} 
//                     </div>
//                     )
//                 },
//                 {
//                     field: 'totalservice_price',
//                     headerName: 'Total Service Price',
//                     minWidth: 150,
//                     editable: false,
//                     renderCell: (params) => (
//                     <div>
//                         $ { Number(params.row.ServiceAmount).toFixed(2)}
//                     </div>
//                     )
//                 },
//                 {
//                     field: 'total_tips',
//                     headerName: 'Total Tips',
//                     minWidth: 150,
//                     editable: false,
//                     renderCell: (params) => (
//                     <div>
//                         $ { Number(params.row.Tips).toFixed(2)} 
//                     </div>
//                     )
//                 },
//                 {
//                     field: 'total_discount',
//                     headerName: 'Total Discount',
//                     minWidth: 150,
//                     editable: false,
//                     renderCell: (params) => (
//                     <div>
//                         $  { Number(params.row.Discount).toFixed(2)}  
//                     </div>
//                     )
//                 },
//                 {
//                     field: 'Action',
//                     headerName:'Action',
//                     minWidth:200,
//                     renderCell: (params) => (
//                     <strong>    
//                         {
//                         <ButtonContent permission_id = "web_view_salary" permission_label="Show view salary"
//                         variant="contained" 
//                         size="small" 
//                         onClick={()=>this.openReport(params.row)} 
//                         label="View"/> 
//                         }    
                           
                    
//                     </strong>
//                     ),
//                 }
//                 ],
//             from_date:new Date(),
//             to_date:new Date(),
//             employee_details:[],
//             commission:{}
           
//          };
//          this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
//          this.handlechangeToDate = this.handlechangeToDate.bind(this);
//          this.submiteReport = this.submiteReport.bind(this)
//     }
//     componentDidMount(){
//         this.getEmpDetails()
//         this.getEmpReportList()
//     }
//     getEmpDetails() {
//         var userdetail = window.localStorage.getItem('userdetail');
//         if(userdetail !== undefined && userdetail !== null){
//             this.setState({isLoading: true})
//             axios.get(`${process.env.REACT_APP_APIURL}/employee/`+JSON.parse(userdetail).businessId).then((res)=>{
//                 this.setState({isLoading: false,employee_details:res.data.data}, function(){
//                 })
//             });
//         }
//     }
//     getEmpReportList(){
//         var userdetail = window.localStorage.getItem('userdetail');
//         if(userdetail !== undefined && userdetail !== null){
//             this.setState({isLoading: true})
//             axios.post(`${process.env.REACT_APP_APIURL}/employee_commission/getPayroll`, {businessId:JSON.parse(userdetail).businessId, from_date: this.state.from_date.toISOString(), to_date: this.state.to_date.toISOString()}).then((res)=>{  
//                 this.setState({employee_reportlist:res.data.data}, function(){
//                     // if(this.state.employee_reportlist.length >0){
//                     //     var updateInput = [];
//                     //     updateInput = this.state.employee_reportlist;
//                     //     for(var k=0;k<this.state.employee_reportlist.length;k++){
//                     //         let id = this.state.employee_reportlist[k].id
//                     //         let selected_emp = this.state.employee_details.filter(item => item.id === id);
//                     //         // updateInput[k].staff_role =   selected_emp[0].staff_role != null ? selected_emp[0].staff_role : '';

//                     //         var staff_role = ""
//                     //         if(selected_emp.length> 0) {
//                     //             if(selected_emp[0].staff_role !=null) {
//                     //                 staff_role = selected_emp[0].staff_role
//                     //             }
                               
//                     //         }
//                     //         updateInput[k].staff_role = staff_role
//                     //     }
//                     //     this.setState({isLoading: false,employee_reportlist: updateInput });                        
//                     // }
//                     this.setState({isLoading: false})
//                 });
//             })
//         }
//     }
//     handlechangeFromDate(e){
//         this.setState({from_date: e});
//     }
//     handlechangeToDate(e){
//         this.setState({to_date: e});
//     }
//     submiteReport() {
//         this.getEmpReportList();        
//     }
//     openReport(empdetail){
//         var userdetail = window.localStorage.getItem('userdetail');
//         if(userdetail !== undefined && userdetail !== null){
//             this.setState({isLoading: true})
//             axios.post(`${process.env.REACT_APP_APIURL}/employee_commission/getPayrollDetail`, {businessId:JSON.parse(userdetail).businessId, from_date: this.state.from_date.toISOString(), to_date: this.state.to_date.toISOString(), empid: empdetail.id}).then((res)=>{ 
//                     this.setState({selectedEmp: empdetail, ticketslist:res.data.data, commission: res.data.commission}, function(){
//                         this.setState({isEmpSelected: true,openModal: true, isLoading:false});
//                     })
//                 })
//             }
//     }
//     handleCloseReport(){
//         this.setState({isEmpSelected: false,openModal: false});
//     }
    
    
//     render() {
//         return(
//             <Page title="Payout | Astro POS">
//                 {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
//                 <Container maxWidth="xl">
//                     <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
//                     <Typography variant="h4" gutterBottom>
//                         Employee Payout
//                     </Typography>
//                     </Stack>
//                     <Stack spacing={3}>
//                         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
//                             <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                 <DesktopDatePicker
//                                     label="From"
//                                     inputFormat="MM/dd/yyyy"
                                    
//                                     maxDate={new Date()}
//                                     value={this.state.from_date}
//                                     onChange={this.handlechangeFromDate}
//                                     renderInput={(params) => <TextField {...params} />}
//                                 />
//                             </LocalizationProvider>
//                             <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                 <DesktopDatePicker
//                                     label="To"
//                                     inputFormat="MM/dd/yyyy"
//                                     minDate={this.state.from_date}
//                                     maxDate={new Date()}
//                                     value={this.state.to_date}
//                                     onChange={this.handlechangeToDate}
//                                     renderInput={(params) => <TextField {...params} />}
//                                 />
//                             </LocalizationProvider>
//                             <ButtonContent permission_id = "web_get_salary" permission_label="Show get salary"
//                             size="large" 
//                             variant="contained" 
//                             label="Submit" 
//                             onClick={()=>this.submiteReport()}/>
//                         </Stack>
//                     </Stack>
//                     <Card sx={{mt:2}}  style={{height: '80%'}}>
//                         <TableContent permission_id = "web_list_salary" permission_label="Show list salary"
//                         style={{height: '100%'}} 
//                         data={this.state.employee_reportlist} 
//                         columns={this.state.columns} />
//                     </Card> 
//                 </Container>

//                 {this.state.isEmpSelected && <div>
//                     <Dialog open={this.state.openModal} onClose={()=>this.handleCloseReport()} fullWidth maxWidth='md'>
//                         <DialogTitle id="alert-dialog-title"> 
//                         </DialogTitle>
//                         <DialogContent>
//                             <div style={{height:'600px' }}>
//                                 <ReportView commission={this.state.commission} empSelected={this.state.selectedEmp} ticketslist={this.state.ticketslist} from_date={this.state.from_date} to_date={this.state.to_date}/>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                     {/* <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute', zIndex:'999999'}}>
//                         <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
//                         </div>
//                         <div style={{background:'#fff', height:'80%',  width:'80%', margin:'10% auto 0', position:'relative'}}>                             
//                         </div>
//                     </div> */}
//                 </div>}

//             </Page>
//         )
//     }
// }
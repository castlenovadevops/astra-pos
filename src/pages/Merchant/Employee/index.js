import React from "react";
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import HTTPManager from "../../../utils/httpRequestManager";
import TableView from '../../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../components/Iconify';
import FormManager from "../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid, Card,  Container, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import FButton from '../../../components/formComponents/components/button';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class Employee extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            employeelist:[],
            addForm: false,
            selectedEmployee:{},
            defaultcommission:{},
            openDialog: false,
            columns:[
                {
                    field: 'mEmployeeFirstName',
                    headerName: 'Name',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mEmployeeFirstName === ''? '--' : params.row.mEmployeeFirstName + ' ' + params.row.mEmployeeLastName }
                        </div>
                    )
                },
                {
                    field: 'mEmployeeEmail',
                    headerName: 'Email',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                           {params.row.mEmployeeEmail === ''? '--' : params.row.mEmployeeEmail}
                        </div>
                    )
                },
                {
                    field: 'mEmployeeRole',
                    headerName: 'Role',
                    minWidth:100,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                          {params.row.mEmployeeRoleName === ''? '--' : params.row.mEmployeeRoleName}
                        </div>
                    )
                },
                {
                  field: 'mEmployeeCode',
                  headerName: 'PassCode', 
                  editable: false,
                  renderCell: (params) => (
                      <div>
                         {params.row.mEmployeeCode === ''? '--' : params.row.mEmployeeCode}
                      </div>
                  )
                },
                {
                    field: 'Action',
                    headerName:'Actions',
                    flex:1,
                    minWidth:100,
                    renderCell: (params) => (
                        this.getActions(params)                    
                    ),
                }
            ]
        }
        this.handleCloseform = this.handleCloseform.bind(this); 
        this.updateRecord = this.updateRecord.bind(this);
        this.getEmpslist = this.getEmpslist.bind(this);
    }
    updateRecord(row, status){ 
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/employee/update`, {mEmployeeStatus: status, id: row.id}).then(res=>{
                console.log(res.message);
                this.setState({isLoading: false});
                this.reloadData(res.message);
            })
        })
    }
    componentDidMount(){ 
        this.setState({schema: schema},()=>{
            this.reloadData();
        })
    }
    handleCloseform(){
        this.setState({addForm: false})
    }
    getActions(params){
        var detail = window.localStorage.getItem('userdetail')
        if(detail !== '' && detail !== undefined && detail !=='{}'){
          var userdetail = JSON.parse(detail);
        return <div>       
                
               {(userdetail.userRole === 'Admin'  || userdetail.userRole==='Owner')&&  <FButton
                variant="outlined" 
                size="small" 
                onClick={()=>this.openEdit(params.row)} 
                label="Edit"/>}
                
                {(userdetail.userRole === 'Admin' || userdetail.userRole==='Owner') &&  params.row.mEmployeeStatus.toString() === '1' &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, '0')}} 
                    label="Deactivate"/>
                }
                {(userdetail.userRole === 'Admin'  || userdetail.userRole==='Owner')&&  params.row.mEmployeeStatus.toString() === '0'  &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, '1')}} 
                    label="Activate"/>
                }
               
            </div>
        }
    }
    openEdit(data){ 
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        properties.forEach((field,i)=>{
            field.value = data[field.name];
            props.push(field);
            if(i === properties.length-1){
                props.push({
                    "component":"TextField", 
                    "type": "hidden", 
                    "minLength": 1,
                    "maxLength": 50,
                    "grid":6,
                    "name":"id",
                    "label":"id",
                    "placeholder":"id",
                    "value":data.id
                  })
                schema.properties = props; 
                this.setState({schema: schema,selectedEmployee: data},()=>{
                    this.setState({addForm: true})
                })
            }
        })
    }
    reloadData(msg=''){
        if(msg !== ''){ 
            toast.dismiss();
            toast.success(msg, {
                position: "top-center",
                autoClose: 5000,
                closeButton:false,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
        this.setState({isLoading: true, addForm: false},()=>{
            this.httpManager.postRequest(`merchant/defaultcommission/get`,{data:"EMP GET"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data.length > 0){
                    this.setState({defaultcommission: response.data[0] }, ()=>{ 
                        this.getEmpslist()
                    });
                }
                else{
                    this.getEmpslist()
                }
            })
        })
    }

    getEmpslist(){
        this.httpManager.postRequest(`merchant/employee/get`,{data:"EMP LIST"}).then(response=>{
            console.log(response)
            this.setState({employeelist: response.data, isLoading: false});
        })
    }

    handleCloseDialog(){
        this.setState({openDialog: false})
    }

    openAdd(){
        if(this.state.defaultcommission.id){
            this.setState({schema: schema,selectedEmployee: {}},()=>{
                var schemaobj = Object.assign({}, schema);

                var properties = Object.assign([], this.state.schema.properties);
                var props=[];
                properties.forEach((field,i)=>{
                    delete field["value"];
                    props.push(field);
                    if(i === properties.length-1){
                        schemaobj.properties = props;
                    }
                });
                this.setState({schema:schemaobj}, ()=>{
                    this.setState({addForm: true}) 
                })
            })
        }
        else{
            this.setState({openDialog: true})
        }
    }
    render(){
        return <Page title="Employees | Astro POS">
            {this.state.isLoading && <Loader show={this.state.isLoading} />}
            <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            />
            {!this.state.addForm ? 
                <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Employee Management
                    </Typography>
                    <FButton 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Employee"
                    startIcon={getIcon('mdi:plus')}
                    />
                </Stack>

                <Card>
                    <TableView
                    data={this.state.employeelist} 
                    columns={this.state.columns} />
                </Card>
                </Container> : ''
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}> 
                        <Stack spacing={3}> 
                            <FormManager formProps={this.state.schema}  reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}


            <Dialog
                    open={this.state.openDialog}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                       Please set default commission and create employees.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={()=>{
                            this.handleCloseDialog()
                        }}>  OK </Button> 
                    </DialogActions>
                </Dialog>

            </Page>  
    }


}
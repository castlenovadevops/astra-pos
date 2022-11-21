import React from "react";
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import HTTPManager from "../../../utils/httpRequestManager";
import TableView from '../../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../components/Iconify';
import FormManager from "../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid, Card,  Container, Typography, Stack} from '@mui/material';
import FButton from '../../../components/formComponents/components/button';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class Customer extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            customerlist:[],
            addForm: false,
            selectedcustomer:{},
            columns:[
                {
                    field: 'mCustomerName',
                    headerName: 'Name',
                    minWidth:200,
                    flex:1,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mCustomerName === ''? '--' : params.row.mCustomerName }
                        </div>
                    )
                },
                {
                    field: 'mCustomerMemberId',
                    headerName: 'Member ID',
                    minWidth:200,
                    flex:1,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                           {params.row.mCustomerMemberId === ''? '--' : params.row.mCustomerMemberId}
                        </div>
                    )
                },
                {
                    field: 'mCustomertPhone',
                    headerName: 'Phone',
                    minWidth:150,
                    flex:1,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                          {params.row.mCustomerMobile === '' ? '--' : params.row.mCustomerMobile}
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
            ],
        }
        this.handleCloseform = this.handleCloseform.bind(this); 
        this.updateRecord = this.updateRecord.bind(this);
    }
    updateRecord(row, status){ 
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/customers/updateCustomer`, {mCustomerStatus: status, id: row.id}).then(res=>{
                // console.log(res.message);
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
        // console.log("params",params);
        var detail = window.localStorage.getItem('userdetail')
        if(detail !== '' && detail !== undefined && detail !=='{}'){
          var userdetail = JSON.parse(detail);
        return <div>       
                
                {(userdetail.userRole === 'Admin' || userdetail.userRole==='Owner') && <FButton  permission_id = "web_edit_customer" permission_label="Show edit customer"
                variant="outlined" 
                size="small" 
                onClick={()=>this.openEdit(params.row)} 
                label="Edit"/>}
                
                {(userdetail.userRole === 'Admin' || userdetail.userRole==='Owner') &&  params.row.mCustomerStatus.toString() === '1'  &&
                    <FButton permission_id = "web_status_customer" permission_label="Show status customer"
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, 0)}} 
                    label="Deactivate"/>
                }
                {(userdetail.userRole === 'Admin' || userdetail.userRole==='Owner') &&  params.row.mCustomerStatus.toString()==='0'  && 
                    <FButton permission_id = "web_status_customer" permission_label="Show status customer"
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, 1)}} 
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
                this.setState({schema: schema,selectedcustomer: data},()=>{
                    this.setState({addForm: true})
                })
            }
        })
    }
    reloadData(msg=''){
        // console.log("111")
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
            this.httpManager.getRequest(`merchant/customers/getCustomer`).then(response=>{
                // console.log(response)
                this.setState({customerlist: response.data, isLoading: false});
            })

            // this.httpManager.getRequest(`merchant/customers/getCustomer`).then(response=>{
            //     var data = [];
            //     // console.log("response",response.data);
            //     if(response.data.length > 0){
            //         response.data.forEach((elmt, i)=>{ 
            //             elmt.id = elmt.mCustomerId;
            //             data.push(elmt);
            //             if(i === response.data.length-1){
            //                 this.setState({customerlist: data, isLoading: false});
            //             }
            //         })
            //     }
            //     else{
            //         this.setState({customerlist: data, isLoading: false});
            //     }
            // })
        })
    }
    openAdd(){
        this.setState({schema: schema,selectedcustomer: {}},()=>{
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
    render(){
        return <Page title="Customer | Astro POS">
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
                    Customer Management
                    </Typography>
                    <FButton 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Customer"
                    startIcon={getIcon('mdi:plus')}
                    />
                </Stack>

                <Card>
                    <TableView
                    data={this.state.customerlist} 
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
            </Page>
    }
}
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

export default class Discount extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            discountlist:[],
            addForm: false,
            selectedDiscount:{},
            columns:[
                {
                    field: 'mDiscountName',
                    headerName: 'Name',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mDiscountName}
                        </div>
                    )
                },
                {
                    field: 'mDiscountType',
                    headerName: 'Type',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div style={{textTransform:'capitalize'}}>
                            {params.row.mDiscountType}
                        </div>
                    )
                },
                {
                    field: 'mDiscountValue',
                    headerName: 'Value',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mDiscountType ===  'amount'? '$' + params.row.mDiscountValue : params.row.mDiscountValue+'%' }
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
        this.changePercentage = this.changePercentage.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    onStateChange(values){

        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        var required = Object.assign([], this.state.schema.required)
        properties.forEach((field,i)=>{

            if(values.mDiscountType === 'Amount' && field.name === 'mDiscountValue'){
                field.format = 'currency'
                field.type = 'text'
                field.value = values[field.name];
            }
            else if(values.mDiscountType === 'Percentage' && field.name === 'mDiscountValue'){
                field.format = 'percentage'
                field.type = 'text'
                field.value = values[field.name];
            }
            else if(values.mDiscountDivisionType === 'Both' && field.name === 'mOwnerDivision'){
                field.format = 'percentage'
                field.type = 'text'
                field.value = values[field.name];
                if(required.indexOf('mOwnerDivision') === -1){
                    required.push('mOwnerDivision')
                }
            }
            else if(values.mDiscountDivisionType === 'Both' && field.name === 'mEmployeeDivision'){
                field.format = 'percentage'
                field.type = 'text'
                field.value = values[field.name];
                if(required.indexOf('mEmployeeDivision') === -1){
                    required.push('mEmployeeDivision')
                }
            }
            else if(values.mDiscountDivisionType !== 'Both' && field.name === 'mOwnerDivision'){
                field.format = 'percentage'
                field.type = 'hidden'
                field.value = values[field.name];
                if(required.indexOf('mOwnerDivision') !== -1){
                    let idx = required.indexOf('mOwnerDivision') 
                    required.splice(idx,1)
                }
            }
            else if(values.mDiscountDivisionType !== 'Both' && field.name === 'mEmployeeDivision'){
                field.format = 'percentage'
                field.type = 'hidden'
                field.value = values[field.name];
                if(required.indexOf('mEmployeeDivision') !== -1){
                    let idx = required.indexOf('mEmployeeDivision') 
                    required.splice(idx,1)
                }
            }
            else{ 
                field.value = values[field.name];
            }
            props.push(field);
            if(i === properties.length-1){ 
                schema.force = true
                schema.required = required
                schema.properties = props; 
                this.setState({schema: schema},()=>{
                    this.setState({addForm: true})
                })
            }
        })
    }


    changePercentage(props, values){
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var schemaprops=[];
        properties.forEach((field,i)=>{ 
            if(props.name === 'mOwnerDivision' && field.name === 'mEmployeeDivision'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mEmployeeDivision' && field.name === 'mOwnerDivision'){ 
                field.value = 100 - Number(props.value);  
            }
            else{
                field.value = values[field.name]
            }
            schemaprops.push(field);
            if(i === properties.length-1){ 
                // console.log(schemaprops)
                schema.properties = schemaprops; 
                schema.force = true; 
                this.setState({schema: schema},()=>{
                    this.setState({addForm: true})
                })
            }
        });
    }

    updateRecord(row, status){ 
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/discounts/updateDiscount`, {mDiscountStatus: status, id: row.id}).then(res=>{
                // console.log(res.message);
                this.setState({isLoading: false});
                this.reloadData(res.message);
            })
        })
    }
    componentDidMount(){ 
        this.setState({schema: schema},()=>{
            // console.log(schema)
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
                
               {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') &&  <FButton
                variant="outlined" 
                size="small" 
                onClick={()=>this.openEdit(params.row)} 
                label="Edit"/>}
                
                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.mDiscountStatus==='1' &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, '0')}} 
                    label="Deactivate"/>
                }
                {(userdetail.mEmployeeRoleName === 'Admin'  || userdetail.mEmployeeRoleName==='Owner') && params.row.mDiscountStatus==='0'  &&
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
                  props.push({
                      "component":"TextField", 
                      "type": "hidden", 
                      "minLength": 1,
                      "maxLength": 50,
                      "grid":6,
                      "name":"mDiscountId",
                      "label":"mDiscountId",
                      "placeholder":"mDiscountId",
                      "value":data.mDiscountId
                    })
                schema.properties = props; 
                this.setState({schema: schema,selectedDiscount: data},()=>{
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
            this.httpManager.postRequest(`merchant/discounts/getDiscount`,{data:"DISCOUNT LIST"}).then(response=>{
                // console.log(response)
                this.setState({discountlist: response.data, isLoading: false});
            })

           
        })
    }
    openAdd(){
        this.setState({schema: {},selectedDiscount: {}},()=>{
            var schemaobj = Object.assign({}, schema);

            var properties = Object.assign([],  schema.properties);
            var props=[];
            properties.forEach((field,i)=>{ 
                if(field.name === 'mDiscountType'){
                    field.value = 'Amount' 
                }
                else if(field.name === 'mDiscountDivisionType'){
                    field.value = 'Owner'
                }
                else if(field.name === 'mDiscountValue'){
                    field.format = 'currency'
                    field.value = ''
                }
                else if(field.name === 'mOwnerDivision' || field.name === 'mEmployeeDivision'){
                    field.format = 'percentage'
                    field.type = "hidden"
                    field.value = ''
                }
                else{
                    field.value = ''
                }

                props.push(field);
                if(i === properties.length-1){
                    schemaobj.properties = props;
                }
            });
            // console.log(schemaobj)
            schemaobj.force= true;
            this.setState({schema:schemaobj}, ()=>{
                this.setState({addForm: true}) 
            })
        })
    }
    render(){
        return <Page title="Discount | Astro POS">
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
                    Discount
                    </Typography>
                    <FButton 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Discount"
                    startIcon={getIcon('mdi:plus')}
                    />
                </Stack>

                <Card>
                    <TableView
                    data={this.state.discountlist} 
                    columns={this.state.columns} />
                </Card>
                </Container> : ''
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>  
                        <Stack spacing={3}> 
                            <FormManager formProps={this.state.schema} formFunctions={{
                                onStateChange: this.onStateChange,
                                changePercentage: this.changePercentage
                            }} reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
            
    }
}
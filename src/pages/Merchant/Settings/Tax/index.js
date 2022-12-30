import React from "react";
import Loader from '../../../../components/Loader';
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager";
import TableView from '../../../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../../components/Iconify';
import FormManager from "../../../../components/formComponents/FormManager";
import schema from './schema.json';
import parse from 'html-react-parser'
import {Box, Grid, Card, Container,  Typography, Stack,  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button} from '@mui/material';
import FButton from '../../../../components/formComponents/components/button';

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class Tax extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            taxlist:[],
            addForm: false,
            selectedtaxes:{},
            showFormActionError: false,
            formActionError:'',
            columns:[
                {
                    field: 'mTaxName',
                    headerName: 'Tax Name',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mTaxName === ''? '--' : params.row.mTaxName }
                        </div>
                    )
                },
                {
                    field: 'mTaxType',
                    headerName: 'Tax Type',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                           {params.row.mTaxType === ''? '--' : params.row.mTaxType}
                        </div>
                    )
                },
                {
                    field: 'mTaxValue',
                    headerName: 'Tax Value',
                    minWidth:150,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                          {params.row.mTaxValue === ''? '--' : params.row.mTaxValue}
                        </div>
                    )
                },
                {
                    field: 'mTaxStatus',
                    headerName: 'Tax Status',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                           {params.row.mTaxStatus === 1? 'Active' : 'Inactive'}
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
            showForm: false
        }
        this.handleCloseform = this.handleCloseform.bind(this); 
        this.updateRecord = this.updateRecord.bind(this);
        this.saveForm = this.saveForm.bind(this)
        this.renderErrorActionButtons = this.renderErrorActionButtons.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this)
        this.onStateChange = this.onStateChange.bind(this);
    }

    onStateChange(values){ 
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        var required = Object.assign([], this.state.schema.required)
        properties.forEach((field,i)=>{

            if(values.mTaxType === 'Flat fee' && field.name === 'mTaxValue'){
                field.format = 'currency'
                field.type = 'text'
                field.maxLength = 6
                field.value = values[field.name];
            }
            else if(values.mTaxType === 'Percentage' && field.name === 'mTaxValue'){
                field.format = 'percentage'
                field.type = 'text'
                field.maxLength = 5
                field.value = values[field.name];
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


    handleCloseDialog(){
        this.setState({isLoading: false, showFormActionError: false, selectedtaxes: {}, formActionError:''}) 
    }

    saveForm(data){
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/tax/save`, data).then(res=>{
                // console.log(res.message);
                this.setState({isLoading: false});
                this.reloadData(res.message);
            })
        })
    }

    updateRecord(row, status){ 
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/tax/update`, {cnUserStatus: status, id: row.id}).then(res=>{
                // console.log(res.message);
                this.setState({isLoading: false});
                this.reloadData(res.message);
            })
        })
    }
    componentDidMount(){ 
        var schemaobj = Object.assign({}, schema);
        var properties = Object.assign([], schemaobj.properties);
        var props=[];
        var required = Object.assign([], schemaobj.required)
        properties.forEach((field,i)=>{

            if(field.name === 'mTaxValue'){
                field.format = 'percentage'
                field.type = 'text'
                field.maxLength = 6
            }
            else if(field.name === 'mTaxType'){ 
                field.type = 'text'
                field.maxLength = 5
                field.value = "Percentage";
            }  
            props.push(field);
            if(i === properties.length-1){ 
                schemaobj.force = true
                schemaobj.required = required
                schemaobj.properties = props; 
                // console.log(props)
                this.setState({showForm: true,schema: Object.assign({},schemaobj)},()=>{
                    this.reloadData();
                })
            }
        })
        
    }
    handleCloseform(){
        this.setState({addForm: false, isLoading: false})
    }
    getActions(params){
        var detail = window.localStorage.getItem('userdetail')
        if(detail !== '' && detail !== undefined && detail !=='{}'){
          var userdetail = JSON.parse(detail);
        return <div>     
        {(userdetail.mEmployeeRoleName !== 'Admin' && userdetail.mEmployeeRoleName!=='Owner') && <div style={{margin:'0 8px'}}>N/A</div>}
                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && <FButton
                variant="outlined" 
                size="small" 
                onClick={()=>this.openEdit(params.row)} 
                label="Edit"/>}
                
                {/* {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.mTaxStatus.toString()==='1' &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, 0)}} 
                    label="Deactivate"/>
                }

                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.mTaxStatus.toString()==='0'  &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, 1)}} 
                    label="Activate"/>
                }
                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.isDefault.toString()==="1"  &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.removeDefault(params.row, 1)}} 
                    label="Remove Default"/>
                }
                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.isDefault.toString()!=="1"  &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.makeDefault({isDefault:1, id:params.row.id}, params.row)}} 
                    label="Make Default"/>
                } */}
               
            </div>
        }
    }

    removeDefault(row){
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/tax/updateTaxDefault`, {isDefault: 0, id: row.id}).then(res=>{
                // console.log(res.message);
                this.setState({isLoading: false});
                this.reloadData(res.message);
            })
        })
    }

    makeDefault(input, row){ 
        this.setState({isLoading: true, selectedtaxes: row}, ()=>{
            input.id = row.id
            this.httpManager.postRequest(`merchant/tax/updateTaxDefault`, input).then(res=>{
                // console.log(res.message);
                this.setState({isLoading: false, selectedtaxes: {},showFormActionError: false,  formActionError:''});
                this.reloadData(res.message);
            }).catch(e=>{
                // console.log(e) 
                    this.setState({isLoading: false, showFormActionError: true, formActionError:e.message}) 
            })
        })
    }

    openEdit(data){ 
        var schemaobj = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        properties.forEach((field,i)=>{
            field.value = data[field.name];
            if(field.name === 'isDefault'){
                // console.log(data)
                var obj = []
                obj.push(data[field.name]);
                field.value = obj;
            }
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
                      "name":"mTaxId",
                      "label":"mTaxId",
                      "placeholder":"mTaxId",
                      "value":data.mTaxId
                    })
                    // console.log(properties)
                    schemaobj.properties = props; 
                this.setState({schema: schemaobj,selectedtaxes: data},()=>{
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
            this.httpManager.postRequest(`merchant/tax/get`,{data:"GEGT TAX"}).then(response=>{
                // console.log("RESPONSE")
                // console.log(response)
                this.setState({taxlist: response.data, isLoading: false, addForm: false});
            })
        })
    }
    openAdd(){ 
        var schemaobj = Object.assign({}, schema);
        var properties = Object.assign([], schemaobj.properties);
        var props=[];
        var required = Object.assign([], schemaobj.required)
        properties.forEach((field,i)=>{

            if(field.name === 'mTaxValue'){
                field.format = 'percentage'
                field.type = 'text'
                field.maxLength = 6
            }
            else if(field.name === 'mTaxType'){ 
                field.type = 'text'
                field.maxLength = 5
                field.value = "Percentage";
            }  
            else{
                delete field.value
            }
            props.push(field);
            if(i === properties.length-1){ 
                schemaobj.force = true
                schemaobj.required = required
                schemaobj.properties = props; 
                // console.log(props)
                this.setState({addForm: true,schema: Object.assign({},schemaobj)},()=>{ 
                })
            }
        })
    }


    renderErrorActionButtons(){
        var buttons = []
        if(this.state.schema.onSubmit !== undefined){
            // console.log(this.state.schema.onSubmit.onError)
            if(this.state.schema.onSubmit.onError.actionButtons){
                this.state.schema.onSubmit.onError.actionButtons.forEach(btn=>{
                    const {label,  variant} = btn;

                    buttons.push( 
                        <FButton  style={{  width:'100%', margin:'5px 0'}} fullWidth size="large" variant={variant} label={label} onClick={()=>{
                            
                            var input = {
                                isDefault: 1, 
                                id: this.state.selectedtaxes.id,
                                updateDefault:1
                            }
                            if(label === "Use the current as default"){
                                this.makeDefault(input, this.state.selectedtaxes)
                            }
                            else{
                                input.updateDefault = 0;
                                this.makeDefault(input, this.state.selectedtaxes)
                            }
                        }
                        }/>
                    )
                })
            }
        }
        return buttons;
    }

    render(){
        return <Page title="Tax | Astro POS">
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
                <Container maxWidth="xl">
            {!this.state.addForm &&
                 <Box sx={{ width: '100%' }}> 
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Tax Management
                    </Typography>
                    <FButton 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Tax"
                    startIcon={getIcon('mdi:plus')}
                    />
                </Stack>

                <Card>
                    <TableView
                    data={this.state.taxlist} 
                    columns={this.state.columns} />
                </Card>
                </Box>  
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}> 
                        <Stack spacing={3}> 
                            {this.state.showForm && <FormManager formProps={this.state.schema}  formFunctions={{
                                onStateChange: this.onStateChange,
                             }} reloadData={(msg)=>this.reloadData(msg)} closeForm={(label='', fields={})=>{
                                    var input = fields
                                if(label === "Use the current as default"){
                                    input.updateDefault = 1
                                    this.saveForm(input)
                                }
                                else{
                                    input.updateDefault = 0
                                    this.saveForm(input)
                                }

                                this.handleCloseform()}}/> }
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Container>
            <Dialog 
                    open={this.state.showFormActionError}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{margin:'10px'}}>
                        {parse(this.state.formActionError)}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', flexDirection:'column'}}>
                            {this.renderErrorActionButtons()}
                            <Button variant="outlined" style={{width:'100%', margin:'5px 0'}} onClick={()=>{
                                this.setState({showFormActionError: false, formActionError:'', onError:{}, selectedtaxes:{}})
                            }}>Cancel </Button> 
                        </div>
                    </DialogActions>
                </Dialog>

            </Page>
    }

}
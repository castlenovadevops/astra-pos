import React from "react";
import Loader from '../../../../components/Loader';
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager";
import TableView from '../../../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../../components/Iconify';
import FormManager from "../../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid, Card,  Container, Typography, Stack} from '@mui/material';
import FButton from '../../../../components/formComponents/components/button'; 

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class ProductService extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            serviceslist:[],
            addForm: false,
            selectedservice:{},
            columns:[
                {
                    field: 'mProductName',
                    headerName: 'Name',
                    minWidth: 250,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mProductName}
                        </div>
                    )
                    },
                // {
                //     field: 'psCategory',
                //     headerName: 'Category',
                //     minWidth: 250,
                //     editable: false,
                //     renderCell: (params) => (
                //         <div style={{textTransform:'capitalize'}}>
                //             {params.row.psCategory}
                //         </div>
                //     )
                //     },
                {
                    field: 'mProductType',
                    headerName: 'Type',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                        <div style={{textTransform:'capitalize'}}>
                            {params.row.mProductType}
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
            defaultTaxes:[]
        }
        this.handleCloseform = this.handleCloseform.bind(this); 
        this.updateRecord = this.updateRecord.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setTax = this.setTax.bind(this)
        this.onStateChange = this.onStateChange.bind(this);
    }



    onStateChange(values){
        // console.log("STATE CHANGE CALLED")
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        var required = Object.assign([], this.state.schema.required)
        properties.forEach((field,i)=>{  
            if(field.name === 'mProductTaxes' && values["mProductTaxType"] === 'Default'){
                field.type = "hidden"
                field.value = values[field.name];
            } 
            else if(field.name === 'mProductDefaultTaxes' && values["mProductTaxType"] === 'Custom'){
                field.type = "hidden"
                field.value = values[field.name];
            } 
            else if(field.name === 'mProductDefaultTaxes' && values["mProductTaxType"] === 'No Tax'){ 
                field.type = "hidden"
                field.value = [];
            } 
            else if(field.name === 'mProductTaxes' && values["mProductTaxType"] === 'No Tax'){ 
                field.type = "hidden"
                field.value = []
            } 
            else if(field.name === 'mProductTaxes' && values["mProductTaxType"] === 'Custom'){
                field.type = "text"
                field.value = values[field.name];
            } 
            else if(field.name === 'mProductDefaultTaxes' && values["mProductTaxType"] === 'Default'){
                field.type = "text" 
                field.value = Object.assign([], this.state.defaultTaxes);
            } 
            else if(field.name === 'mProductPrice' && values["mProductPriceType"] === 'Variable'){
                field.disabled=true;
                let idx = required.indexOf(field.name);
                field.value = values[field.name];
                required.splice(idx,1)
            }
            else if(field.name === 'mProductPrice' && values["mProductPriceType"] !== 'Variable'){
                field.disabled=false; 
                required.push(field.name)
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

    updateRecord(row, status){ 
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/product/update`, {mProductStatus: status, id: row.id}).then(res=>{
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
        var detail = window.localStorage.getItem('userdetail')
        if(detail !== '' && detail !== undefined && detail !=='{}'){
          var userdetail = JSON.parse(detail);
        return <div>       
                
                {(userdetail.mEmployeeRoleName === 'Admin'  || userdetail.mEmployeeRoleName==='Owner')&& <FButton
                variant="outlined" 
                size="small" 
                onClick={()=>this.openEdit(params.row)} 
                label="Edit"/>}
                
                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.mProductStatus==='1' &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    onClick={()=>{this.updateRecord(params.row, 0)}} 
                    label="Deactivate"/>
                }
                {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') && params.row.mProductStatus==='0'  &&
                    <FButton
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
                    "name":"mProductId",
                    "label":"mProductId",
                    "placeholder":"mProductId",
                    "value":data.mProductId
                  })

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
                this.setState({schema: schema,selectedservice: data},()=>{
                    this.onStateChange(data)
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
            this.httpManager.postRequest(`merchant/tax/getByType`, {type:'default'}).then(response=>{ 
                var taxids = response.data.map(e=>e.mTaxId)
                this.setState({defaultTaxes: taxids})
            })
            this.httpManager.postRequest(`merchant/product/get`,{data:"GET PRODUCT"}).then(response=>{ 
                // console.log(response.data)
                this.setCategory(0, response.data, [])
            })
        })
    }

    setCategory(idx, products, finalResult){
        // console.log("CATEGORU")
        if(idx < products.length){
            var obj = Object.assign({}, products[idx]);
            if(products[idx].mProductCategories.length > 0){
                obj.mProductCategories = [];
                products[idx].mProductCategories.forEach((o, i)=>{
                    obj.mProductCategories.push(o.mCategoryId)
                    if(i === obj.mProductCategories.length-1){ 
                        if(finalResult[idx]){
                            finalResult[idx]= obj
                        }
                        else{
                            finalResult.push(obj);
                        }
                        this.setCategory(idx+1, products, finalResult);
                    }
                })
            }
            else{
                // console.log("ELSE COND", idx)
                if(finalResult[idx]){
                    finalResult[idx]= obj
                }
                else{
                    finalResult.push(obj);
                }
                this.setCategory(idx+1, products, finalResult);
            }
        }
        else{
            // console.log(finalResult)
            this.setTax(0, products, finalResult)
        }
    }


    setTax(idx, products, finalResult){
        // console.log("TAX")
        if(idx < products.length){
            var obj = Object.assign({}, finalResult[idx]);
            if(products[idx].mProductTaxes.length > 0){
                obj.mProductTaxes = [];
                products[idx].mProductTaxes.forEach((o, i)=>{ 
                    obj.mProductTaxes.push(o.mTaxId)
                    if(i === obj.mProductTaxes.length-1){
                        finalResult[idx]= obj
                        this.setTax(idx+1, products, finalResult);
                    }
                })
            }
            else{
                finalResult[idx] = obj;
                this.setTax(idx+1, products, finalResult);
            }
        }
        else{ 
            this.setState({serviceslist: finalResult, isLoading: false}, ()=>{ 
            });
        }
    }

    openAdd(){
        this.setState({schema: schema,selectedservice: {}},()=>{
            var schemaobj = Object.assign({}, schema);

            var properties = Object.assign([], this.state.schema.properties);
            var props=[];
            properties.forEach((field,i)=>{ 
                if(field.name === 'mProductTaxType'){
                    field.value = 'Default'
                }
                else if(field.name === 'mProductType'){
                    field.value = 'Product'
                }
                else if(field.name === 'mProductPriceType'){
                    field.value = 'Fixed'
                }
                else if(field.name === 'mProductDefaultTaxes'){ 
                    field.value = Object.assign([], this.state.defaultTaxes);
                }
                else if(field.name === 'mProductTaxes'){
                    field.type = "hidden"
                }
                else{
                    delete field["value"]
                }
                props.push(field);
                if(i === properties.length-1){ 
                    schemaobj.force=true;
                    schemaobj.properties = props;
                    this.setState({schema:schemaobj}, ()=>{
                        this.setState({addForm: true}) 
                    })
                }
            });
        })
    }
    render(){
        return <Page title="Product Service | Astro POS">
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
                    Product & Service
                    </Typography>
                    <FButton 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Product & Service"
                    startIcon={getIcon('mdi:plus')}
                    />
                </Stack>

                <Card>
                    <TableView
                    data={this.state.serviceslist} 
                    columns={this.state.columns} />
                </Card>
                </Container> : ''
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}> 
                        <Stack spacing={3}> 
                            <FormManager formProps={this.state.schema} formFunctions={{
                                onStateChange: this.onStateChange
                            }} reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
    }

}
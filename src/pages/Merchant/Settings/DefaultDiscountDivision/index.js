import React from "react";
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager"; 
import { toast, ToastContainer } from 'react-toastify'; 
import FormManager from "../../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid,   Container, Typography, Stack} from '@mui/material'; 

export default class DefaultDiscountDivision extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            default_discountlist:[],
            addForm: false,
            selectedDiscount:{},
            columns:[]
        }
        this.changePercentage = this.changePercentage.bind(this)
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
    
    componentDidMount(){ 
        this.setState({schema: schema},()=>{
            this.reloadData();
        })
    } 

    syncData(){
        var table = {
            name: "mDefaultDiscountDivision",
            tablename: 'mDefaultDiscountDivision',
            progressText: "Synchronizing Default Discount Division Settings...",
            progresscompletion: 10,
            url:  `/pos/syncData/defaultDiscountDivision`
        } 
        this.httpManager.postRequest(table.url, {data:"TAX"}).then(res=>{ 
            this.httpManager.postRequest(`merchant/defaultdiscount/get`,{data:"GET DISCOUNT DIVISION"}).then(response=>{
                if(response.data.length > 0){
                    this.setState({selectedDiscount: response.data[0] }, ()=>{
                        this.openEdit(this.state.selectedDiscount)
                    });
                }
                else{
                    this.setState({isLoading: false})
                } 
            })
        }).catch(e=>{

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
            this.syncData()
        })
    }
    openEdit(data){ 
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        var dstr= window.localStorage.getItem("merchantdetail");
        var merchantdetail = JSON.parse(dstr);
        var ustr= window.localStorage.getItem("userdetail");
        var udetail = JSON.parse(ustr);
        var merchantId = merchantdetail.merchantId
        var posid = merchantdetail.device.POSId
        var empid = udetail.mEmployeeId
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
                    "name":"merchantId",
                    "label":"id",
                    "placeholder":"id",
                    "value":merchantId
                  })

                  props.push({
                      "component":"TextField", 
                      "type": "hidden", 
                      "minLength": 1,
                      "maxLength": 50,
                      "grid":6,
                      "name":"empid",
                      "label":"id",
                      "placeholder":"id",
                      "value":empid
                    })

                    props.push({
                        "component":"TextField", 
                        "type": "hidden", 
                        "minLength": 1,
                        "maxLength": 50,
                        "grid":6,
                        "name":"POSId",
                        "label":"id",
                        "placeholder":"id",
                        "value":posid
                      })
                schema.properties = props; 
                // console.log(schema)
                this.setState({schema: schema,selectedDiscount: data},()=>{
                   
                })
            }
        })
    }
    render(){
        return <Page title="Default Discount Division | Astro POS">
            {/* {this.state.isLoading && <Loader show={this.state.isLoading} />} */}
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
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Default Discount Division
                    </Typography>
                    
                </Stack>
                {this.state.selectedDiscount !== '' && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>

                        <Stack spacing={3}>
                            
                            {this.state.schema.formName && <FormManager disableOffline={true} formProps={this.state.schema} formFunctions={{
                                changePercentage: this.changePercentage
                            }} reloadData={(msg)=>{
                                this.reloadData(msg)
                            }} />}
                        </Stack>
                    </Grid>
                </Grid>

                </Box>}
            </Container>

        </Page>
    }

}
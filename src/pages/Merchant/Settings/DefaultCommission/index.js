import React from "react";
import Loader from '../../../../components/Loader';
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager"; 
import { toast, ToastContainer } from 'react-toastify';
import FormManager from "../../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid,   Container, Typography, Stack} from '@mui/material';
export default class CommissionPayment extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:true,
            schema:{},
            commissionlist:[],
            addForm: false,
            selectedcommission:{},
            columns:[]
        } 
        this.changePercentage  = this.changePercentage.bind(this)
    } 

    openAdd(){
        this.setState({schema: schema,selectedcommission: {}},()=>{
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
    componentDidMount(){  
        this.setState({schema: schema},()=>{
            // console.log(this.state.schema)
            this.reloadData();
        })
    }

    changePercentage(props, values){
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var schemaprops=[];
        properties.forEach((field,i)=>{
            if(props.name === 'mTipsCashPercentage' && field.name === 'mTipsCheckPercentage'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mTipsCheckPercentage' && field.name === 'mTipsCashPercentage'){ 
                field.value = 100 - Number(props.value);  
            }
            else if(props.name === 'mCashPercentage' && field.name === 'mCheckPercentage'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mCheckPercentage' && field.name === 'mCashPercentage'){ 
                field.value = 100 - Number(props.value);  
            }
            else if(props.name === 'mOwnerPercentage' && field.name === 'mEmployeePercentage'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mEmployeePercentage' && field.name === 'mOwnerPercentage'){ 
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
            this.httpManager.postRequest(`merchant/defaultcommission/get`,{data:"GET COMMISSION"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data.length > 0){
                    this.setState({selectedcommission: response.data[0] }, ()=>{
                        this.openEdit(this.state.selectedcommission)
                    });
                }
                else{
                    this.setState({isLoading: false})
                }
            })
        })
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
                this.setState({schema: schema,selectedcommission: data, isLoading: false},()=>{
                   // console.log("SCHEMA")
                    // console.log(this.state.schema)
                })
            }
        })
    }

    render(){
        return <Page title="Default Commission Payment | Astro POS">
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
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Default Commission Payment
                    </Typography>
                    
                </Stack>
                <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>

                        <Stack spacing={3}> 
                            {this.state.schema.formName && <FormManager formProps={this.state.schema} formFunctions={{  
                                changePercentage: (props, values)=>{
                                   this.changePercentage(props,values);
                                }
                            }} reloadData={()=>{
                                this.reloadData();
                            }}/>}
                        </Stack>
                    </Grid>
                </Grid>

                </Box>
            </Container>
        </Page>
    }

}
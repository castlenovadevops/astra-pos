import React from "react";
import Loader from '../../../../components/Loader';
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager"; 
import { toast, ToastContainer } from 'react-toastify';
import FormManager from "../../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid,   Container, Typography, Stack} from '@mui/material';
import AutoBatchComponent from "../../../../autoBatch";
export default class CommissionPayment extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:true,
            schema:{}, 
            addForm: false,
            selectedSettings:{},
            columns:[]
        }  
    }  
    componentDidMount(){  
        this.setState({schema: schema},()=>{
            console.log(this.state.schema)
            this.reloadData();
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
            this.httpManager.postRequest(`merchant/lpsettings/getActivationSettings`,{data:"FOMR PAGE"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data!== null){
                    this.setState({selectedSettings: response.data }, ()=>{
                        this.openEdit(this.state.selectedSettings)
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
                console.log(data)
        properties.forEach((field,i)=>{ 
            field.value = Number(data[field.name]); 
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
                this.setState({schema: schema,selectedSettings: data, isLoading: false},()=>{
                   console.log("SCHEMA")
                    console.log(this.state.schema)
                })
            }
        })
    }

    render(){
        return <Page title="Loyalty Activation | Astro POS">
            {this.state.isLoading && <Loader show={this.state.isLoading} />}
            <AutoBatchComponent/> 
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
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h4" gutterBottom>
                        Loyalty Activation Settings
                    </Typography>
                    
                </Stack>
                <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>
                        <div style={{display:'flex', flexDirection:'column', color:'#aaa', fontSize:'12px'}}>
                            <p>Threshold - Customer can redeem their loyalty points only the meet the threshold.</p>
                            <p>Ex: If threshold is set to 100 points, customers can redeem the loyalty points when they reach 100 points.</p>
                        </div>
                     </Grid>
                     <Grid item xs={12}>

                        <Stack spacing={3}> 
                            {this.state.schema.formName && <FormManager formProps={this.state.schema}   reloadData={()=>{
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
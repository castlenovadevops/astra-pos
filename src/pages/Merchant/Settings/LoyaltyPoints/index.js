import React from "react";
import Loader from '../../../../components/Loader';
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager"; 
import { toast, ToastContainer } from 'react-toastify';
import FormManager from "../../../../components/formComponents/FormManager";
import schema from '../LPSettings/schema.json';
import {Box, Grid, Card,  Container, Typography, Stack} from '@mui/material';
import LPRedeemSettings from '../LPRedeemSettings';
import LPActivationSettings from '../LPActivationSettings';


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
            this.httpManager.postRequest(`merchant/lpsettings/getSettings`,{data:"FROM TABLE"}).then(response=>{ 
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
            // if(field.name === 'dollarValue'){
                field.value = Number(data[field.name]);
                console.log("POINTSSSSS")
            // }
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
        return <Page title="Loyalty Points Settings | Astro POS">
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
                <Card style={{border:'1px solid #d0d0d0', padding:'1rem'}}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h4" gutterBottom>
                            Loyalty Point Settings
                        </Typography>
                        
                    </Stack>
                    <Box sx={{ width: '100%' }}> 
                    <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                        <Grid item xs={12}>

                            <Stack spacing={3}> 
                                {this.state.schema.formName && <FormManager formProps={this.state.schema}   reloadData={()=>{
                                    this.reloadData();
                                }}/>}
                            </Stack>
                        </Grid>
                    </Grid>

                    </Box>
                </Card>
            </Container>



            <Container maxWidth="xl" style={{marginTop:'2rem'}}>
                <Card style={{border:'1px solid #d0d0d0', padding:'1rem'}}>
                    <LPRedeemSettings />
                </Card>
            </Container> 

            
            <Container maxWidth="xl" style={{marginTop:'2rem'}}>
                <Card style={{border:'1px solid #d0d0d0', padding:'1rem'}}>
                     <LPActivationSettings />
                </Card>
            </Container>

        </Page>
    }

}
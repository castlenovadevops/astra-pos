import React from 'react';
import {Box, Grid, Button, Stack} from '@mui/material';
import Check from '@mui/icons-material/Check';
import './pricing.css';

import FormManager from '../../../components/formComponents/FormManager';
import schema from './schema.json'; 

export default class MerchantRegister extends React.Component{

    constructor(){
        super();
        this.state={
            planlist:[{
                id:'123',
                planName:'Basic',
                planFee:'0.00',
                features:[]
            }],
            selectedPlan:'',
            previewplan:{
                id:'123',
                planName:'Basic',
                planFee:'0.00',
                features:[]
            },

        }
    }

    render(){
        return <>  
            {this.state.selectedPlan === '' && <Box sx={{ width: '100%' }}> 
                        <div class="container group" style={{ marginTop: 20}}>
                        <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 

                                {this.state.planlist.map((plan, i)=>{
                                return (
                                    <Grid item xs={12} sm={6} md={4} style={{paddingLeft:'0'}} onClick={()=>{
                                    this.setState({previewplan:plan})
                                    }}>  
                                        <div className={this.state.previewplan.id === plan.id ? "selected plandetails" : "plandetails"}>
                                            <div style={{padding:'1.5rem'}}>
                                                <img src={this.state.previewplan.id === plan.id ? '/static/icons/systemselect.svg' : '/static/icons/systemnotselect.svg'} alt='systemicon' className='planimg'/>
                                                <span class="plantitle">{plan.planName}</span>
                                                <span class="plantext">Start your account for free</span> 
                                            </div>
                                            <h1><span>${plan.planFee}/month</span></h1>
                                            {/* <h4 style={{padding:'0 1.5rem'}}><span>Key Features:</span></h4> */}
                                            <ul  style={{padding:'1.5rem'}}>
                                            {plan.features.map(feature=>{ 
                                                return <li className="priceli"><Check className='checkicon'/>
                                                {feature.feature} {feature.featureVal}</li>
                                            })}
                                            </ul>
                                            <div style={{alignItems:'center',padding:'1.5rem', display:'flex', width:'100%'}}>
                                                <Button
                                                fullWidth
                                                size="large" 
                                                variant="contained"  className='signupbtn' onClick={()=>{
                                                    this.setState({selectedPlan: plan.id});
                                                }} >Start Account</Button>
                                            </div>
                                        </div>
                                    </Grid> )
                                })}
                                </Grid>
                        </div>
                    </Box>
            } 

            {this.state.selectedPlan !== '' && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={1}></Grid>
                     <Grid item xs={10}>

                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="right" spacing={2}>
                                <Button  onClick={()=>this.goToPlan()} label="Go Back"/>  
                            </Stack> 
                            <FormManager formProps={schema} />
                        </Stack>
                    </Grid>
                    <Grid item xs={1}></Grid> 
                </Grid>
            </Box>}
        </>
    }
}
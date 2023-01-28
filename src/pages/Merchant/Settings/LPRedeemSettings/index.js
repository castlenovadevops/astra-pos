import React from "react";
import Loader from '../../../../components/Loader';
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager"; 
import { toast, ToastContainer } from 'react-toastify'; 
import {Box, Grid,   Container, Typography, Stack, InputAdornment} from '@mui/material';
import AutoBatchComponent from "../../../../autoBatch";
import FTextField from "../../../../components/formComponents/components/textField";
import FButton from "../../../../components/formComponents/components/button";
import FSelect from "../../../../components/formComponents/components/select";
import { checkButtonAccess } from "../../../../utils/protector";
export default class CommissionPayment extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:true, 
            addForm: false, 
            settings:[
                {
                    minimumTicketValue:'',
                    dollarSpent:'',
                    pointsCount:'',
                    settingType:'General'
                }
            ],
            settingType:[
                {
                    label:"General",
                    value:"General"
                },
                {
                    label:"Birthday",
                    value:"Birthday"
                },
                {
                    label:"Others",
                    value:"Others"
                }
            ],
            isDisabled:false
        }  

        this.changeValue = this.changeValue.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }  

    submitForm(){
        this.httpManager.postRequest('merchant/lpsettings/saveRedeemSettings', {settings: Object.assign([], this.state.settings)}).then(res=>{
            this.reloadData();
        })
    }

    componentDidMount(){   
            this.reloadData(); 
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
            this.httpManager.postRequest(`merchant/lpsettings/getRedeemSettings`,{data:"FROM TABLE"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data.length > 0){
                    this.setState({settings: response.data, isLoading: false }, ()=>{
                        
                    });
                }
                else{
                    this.setState({isLoading: false})
                }
            })
        })
    }
    changeValue(e, i){
        var settings = Object.assign([], this.state.settings);

        var obj = settings[i];
        obj[e.target.name] = e.target.value;
        settings[i] = obj;

        this.setState({settings: settings})
    }
    renderForm(){
        var fields = [];
        this.state.settings.forEach((elmt, i)=>{
        fields.push(<Grid container className="redeemcontianer">

                    <Grid item xs={3}>
                        <FTextField disabled={checkButtonAccess('LoyaltyPoints') !== 'W'} tabindex={i+1} InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }} required={true} fullWidth  error={elmt.error} helperText={elmt.helperText} type={'text'} format={'number'} minLength={1} maxLength={4}  label={'Every Dollar Spent'} placeholder={'Every Dollar Spent'} name={'dollarSpent'} value={this.state.settings[i].dollarSpent}   onChange={e=>{
                             this.changeValue(e,i)
                        }}/> 
                    </Grid>
                    <Grid item xs={1}></Grid>   
                    <Grid item xs={3}>
                        <FTextField  disabled={checkButtonAccess('LoyaltyPoints') !== 'W'} tabindex={i+1}  required={true} fullWidth  error={elmt.error} helperText={elmt.helperText} type={'text'} format={'number'} minLength={1} maxLength={4}  label={'Points'} placeholder={'Points'} name={'pointsCount'} value={this.state.settings[i].pointsCount}   onChange={e=>{
                            if(Number(e.target.value) <= 100){
                                this.changeValue(e,i)
                            }
                        }}/>
                    </Grid>
                    <Grid item xs={1}></Grid>   
                    <Grid item xs={3}>
                        <FTextField  disabled={checkButtonAccess('LoyaltyPoints') !== 'W'} tabindex={i+1} required={true} fullWidth  error={elmt.error} helperText={elmt.helperText} type={'text'} format={'number'} minLength={1} maxLength={6}  label={'Min. Ticket Value'} placeholder={'Min. Ticket Value'} name={'minimumTicketValue'} value={this.state.settings[i].minimumTicketValue}   onChange={e=>{
                             this.changeValue(e,i)
                        }}/>
                    </Grid> 
                    {/* <Grid item xs={1}>   
                            <FButton size="large" variant={'contained'} disabled={this.state.isDisabled} label={"-"} onClick={()=>{
                                var settings = Object.assign([], this.state.settings)
                                if(settings.length>0){
                                    settings.splice(i, 1);
                                    this.setState({settings: settings})
                                }
                            }
                            }/>
                    </Grid> */}
            </Grid>)
        })

        var buttons = this.renderButtons();
        fields.push(buttons)
        return fields;
    }

    renderButtons(){
        return <Grid container spacing={3}  alignItems="center" sx={{mt:2}}  justifyContent="center"> 
       <Grid item xs={2}>
           {checkButtonAccess('LoyaltyPoints') === 'W' && <FButton fullWidth size="large" variant={'contained'} disabled={this.state.isDisabled} label={"Save"} onClick={()=>{
               this.submitForm()
           }
           }/>}
       </Grid>  
       </Grid>
    }

    render(){
        return <Page title="Loyalty Points Redeem Settings | Astro POS">
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
                        Loyalty Point Settings 
                    </Typography>
                    
                </Stack>
                <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                    {/* <Grid item xs={12}>
                        <div style={{display:'flex', flexDirection:'column', color:'#aaa', fontSize:'12px'}}>
                             <p> Ex: If the setting is $10 for every dollar spent, customer will get the number of points specified in points field..</p>
                        </div>
                     </Grid> */}
                     <Grid item xs={12}>
                         
                        <Stack spacing={3}> 
                            {this.renderForm()}
                        </Stack>
                    </Grid>
                </Grid>

                </Box>
            </Container>
        </Page>
    }

}
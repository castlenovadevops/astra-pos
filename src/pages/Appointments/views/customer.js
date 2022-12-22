import DialogComponent from '../../../components/Dialog';
import { useState } from 'react';
import { TextField, Button, FormControl } from '@mui/material';
import HTTPManager from '../../../utils/httpRequestManager';
import FPhoneNumber from '../../../components/formComponents/components/phonenumber';

import Iconify from '../../../components/Iconify';
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


const CustomerForm = ({ShowingCustomerForm, setShowingCustomerForm})=>{ 
    const [searched, setSearched] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    
    const httpManager = new HTTPManager();

    return (<>
        {ShowingCustomerForm.customerDetail === undefined  && <> <DialogComponent open={ShowingCustomerForm.visible} title={'Select Customer'}  onClose={()=>{
            setShowingCustomerForm({visible:false})
         }} >
           <div style={{display:'flex',position:'relative', flexDirection:'column',alignItems:'center', borderBottom:'1px solid #f0f0f0'}}>
               <br/><br/> {/* <TextField 
                fullWidth
                label="Search By Mobile"
                name="searched"
                value={searched}
                onChange={(e)=>{setSearched(e.target.value)}}
                error={error}
                helperText={errorText}
                />  */}

                    <FPhoneNumber 
                        label={"Search By Mobile"}
                        fullWidth 
                        name={"search"}
                        required 
                        value={searched}
                        onChange={(e)=>{setSearched(e);
                        
                            setError(false)
                            setErrorText('')}}
                        error={error}
                        helperText={errorText}
                    />

                <Button variant={"contained"} style={{width:'max-content', marginTop:'2rem',marginBottom:'2rem' }} onClick={()=>{
                    setError(false)
                    setErrorText('') 
                    if(searched.trim() !== '+1'){
                        httpManager.postRequest(`/merchant/customers/searchByMobile`,{value:searched}).then(res=>{
                            if(res.data !== undefined){
                                setShowingCustomerForm({visible:true, customerDetail:res.data, selectedGuestCount: 0})
                            }
                            else{ 
                                setError(true)
                                setErrorText(res.message)
                            }
                        })
                    }
                    else{
                        setError(true)
                        setErrorText("Please enter mobile number.")
                    }
                }}>Search</Button>
                <div style={{position:'absolute',bottom:'-13px', background:'#fff', display:'flex', alignItems:'center', fontWeight:'700', fontSize:'16px'}}>OR</div>
            </div>
            <div style={{display:'flex', flexDirection:'column',alignItems:'center', }}>
                <Button variant={"contained"} style={{marginTop:'2rem'}} onClick={()=>{

                }}>Create New Customer</Button>
            </div>
        </DialogComponent> </>}


{ShowingCustomerForm.customerDetail !== undefined && ShowingCustomerForm.completeselectedGuest  === undefined && <DialogComponent open={true} title={'Bringing anyone with you?'}  onClose={()=>{
            setShowingCustomerForm({visible:false})
         }} >
            <div style={{display:'flex',width:'100%', alignItems:'flex-start',flexDirection:'column'}}> 
                <div style={{display:'flex', alignItems:'center',width:'100%',border:'1px solid #f0f0f0',padding:'5px', justifyContent:'space-between'}}>
                    <div style={{display:'flex', width:'90%'}}>
                        {getIcon('mdi:account-group')}&nbsp;&nbsp;Additional People
                    </div>
                    <div>
                    <FormControl fullWidth>  
                                    <TextField  
                                        type="number"  
                                        placeholder="" 
                                        value={ShowingCustomerForm.selectedGuestCount}
                                        color="secondary"   
                                        variant="outlined" 
                                        className='qtyfield'
                                        style={{textAlign:'center', border:0 }}
                                        InputProps={{
                                            startAdornment:<Button
                                                title="-1"
                                                aria-label="-1"
                                                size="medium" 
                                                style={{border:0, fontSize:'18px'}}
                                                onClick={()=>{
                                                    var qty = Number(ShowingCustomerForm.selectedGuestCount) > 0 ? Number(ShowingCustomerForm.selectedGuestCount)-1 : 0; 
                                                    var customer = Object.assign({}, ShowingCustomerForm)
                                                    customer.selectedGuestCount = qty;
                                                    setShowingCustomerForm(customer)
                                                }}
                                                variant="outlined"
                                            >
                                                -  
                                            </Button>,
                                            endAdornment: <Button
                                            title="+1"
                                            aria-label="+1"
                                            size="medium" 
                                            style={{border:0, fontSize:'18px'}}
                                            onClick={()=>{  
                                                var customer = Object.assign({}, ShowingCustomerForm)
                                                var qty = Number(customer.selectedGuestCount ) >= 0 ? Number(customer.selectedGuestCount )+1 : 0; 
                                                    customer.selectedGuestCount = qty;
                                                    setShowingCustomerForm(customer)
                                            }}
                                            variant="outlined"
                                        >
                                            +  
                                        </Button>
                                        ,
                                        }} 
                                    />

                            </FormControl>
                    </div>
                </div>
                <p style={{fontSize:'13px', color:'#ccc'}}>Number of people that are coming with you.</p>
                <div style={{display:'flex', flexDirection:'row', width:'100%', justifyContent:'center',alignItems:'center', }}>
                    <Button variant={"contained"} style={{marginTop:'2rem', marginRight:'0.5rem'}} onClick={()=>{
                        var obj = Object.assign({}, ShowingCustomerForm)
                        obj.completeselectedGuest = true
                        console.log(obj)
                        setShowingCustomerForm(obj)
                    }}>Yes</Button>
                    <Button variant={"outlined"} style={{marginTop:'2rem'}} onClick={()=>{
                        var obj = Object.assign({}, ShowingCustomerForm)
                        obj.completeselectedGuest = true
                        obj.selectedGuestCount = 0;
                        console.log(obj)
                        setShowingCustomerForm(obj)
                    }}>No</Button>
                </div>

</div></DialogComponent>}
</>
    )
  }

export default CustomerForm;
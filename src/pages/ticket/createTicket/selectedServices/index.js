import React from 'react';
import { Grid,Typography, IconButton } from '@mui/material';
import HTTPManager from '../../../../utils/httpRequestManager';
import { CallSplit } from '@mui/icons-material';

import Iconify from '../../../../components/Iconify';
const getIcon = (name) => <Iconify style={{color:'#d0d0d0', marginLeft:'5px'}} icon={name} width={22} height={22} />;
export default class SelectedServicesComponent extends  React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state={
            selectedRow:-1, 
            selectedServices:[]
        }
    }
    

    static getDerivedStateFromProps(nextProps, prevState) { 
        if (nextProps.data.selectedServices !==  prevState.selectedServices || nextProps.data.selectedRow !== prevState.selectedRow) { 
            return {selectedServices: nextProps.data.selectedServices, selectedRow: nextProps.data.selectedRow}
        }
    }

    onSelectRow(rowIndex){
        this.setState({selectedRow: rowIndex},()=>{
            this.props.data.onSelectRowService()
        })
    }

    render(){
        return <Grid container  style={{height:'100%'}} >
             <Grid container spacing={1}  xs={12} style={{ marginLeft:'0', background: '#d0d0d0', marginTop:0,  marginRight: '0px',  height:'43px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    
                    <Grid item xs={12} container justify="flex-start" style={{ paddingLeft: 20}}>

                    <Grid item xs={3} container  justify="flex-start" direction='column'>
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold',maxWidth: 200}}  variant="subtitle2" align="left" noWrap >
                            Service Name
                        </Typography>
                    </Grid>

                    <Grid item xs={2} container justify="flex-start">
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">
                            Qty 
                        </Typography>
                    </Grid>

                    <Grid item xs={4} container justify="flex-start"> 
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">
                            Technician
                        </Typography>
                    </Grid>

                    <Grid item xs={3} container justify="flex-start">
                        <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">
                            <span style={{padding:'0 10px', visibility:'hidden'}}>(+)</span>Price
                        </Typography>
                    </Grid> 
                </Grid>

            </Grid>
            <Grid container style={{height:'calc(100% - 45px)',flexDirection:'column', overflow:'auto' }}>
                {this.state.selectedServices.map((row, index)=>{
                    return  <Grid item sx={12} className="selectedServicesContainer">
                            <Grid container xs={12} justify="flex-start" style={{borderBottom:'2px solid #f0f0f0',position:'relative', cursor: 'pointer',
                                    paddingTop: 10, paddingBottom:10, paddingLeft: 0,
                                background:(this.state.selectedRow === index) ? '#2E83BB' :  (index%2 === 0) ? '#ffffff' : '#F5F5F5',
                                color: (this.state.selectedRow === index) ? 'white' :'black',
                                
                                }} 
                            
                                color={(this.state.selectedRow === index) ? 'white' :'balck'}
                                onClick={(e)=>{
                                    if(!this.props.data.isDisabled) {
                                        e.preventDefault();
                                        e.stopPropagation(); 
                                        this.props.data.onSelectRowService(index,e)}
                                    }
                                    
                                } >

                                        <Grid item xs={3} spacing={10}  justify="flex-start" direction='column' style={{padding:'10px 0 10px 10px', height:'auto', position:'relative',}}>
                                            <Typography id="modal-modal-title" variant="subtitle2" noWrap style={{width:'100%', paddingBottom: 10,wordBreak:'break-word', display:'flex', alignItems:'center',}}>
                                                {row.process  === 'Splitted' &&  <CallSplit style={{height:'16px'}}/>} {row.serviceDetail.mProductName}</Typography>
                                                            
                                            <Typography variant="subtitle2" style={{maxWidth: 200, marginTop: 20 , textAlign:'left'}}>
                                                {row.isSpecialRequest === 1 ?( row.serviceNotes !== '' && row.serviceNotes !== undefined && row.serviceNotes !== null ? row.serviceNotes.substring(0,200) :'(Special Request)'):''}</Typography>                
                                        </Grid>

                                        <Grid item xs={2} container justify="flex-start"  style={{padding:'10px 0 10px 10px'}}>
                                            <Typography id="modal-modal-title" variant="subtitle2"  style={{height:'auto'}} align="center">{row.qty} </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={4} container justify="flex-start"  style={{padding:'10px 0 10px 10px', display:'flex', flexDirection:'row'}}> 
                                        <Typography id="modal-modal-title" variant="div" align="center" style={{display:'flex', width:'100%', flex:'1', justifyContent:'space-between'}}> 
                                                <span style={{fontSize:'14px'}}> {row.technician.mEmployeeFirstName+" "+row.technician.mEmployeeLastName}  </span>
                                                <span style={{fontSize:'14px'}}>{row.serviceDetail.mProductType==='product' ? '(R)' :''}</span>
                                                </Typography>   
                                                {row.ticketservicediscounts.map((discount)=>
                                                    <Grid item xs={12} style={{ padding:'5px 0'}}>
                                                            <Typography id="modal-modal-title" variant="subtitle2" align="left" >{discount.mDiscountName} ({discount.mDiscountType === 'percentage'? Number(discount.mDiscountValue).toFixed(2)+'%' : '$'+Number(discount.mDiscountValue).toFixed(2) }) </Typography>
                                                    </Grid>
                                                )}
                                                {row.ticketservicetaxes.map( (tax) => 
                                                    <Grid item xs={12} style={{ padding:'5px 0' }}> 
                                                                    <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>{tax.mTaxName} 
                                                                    ({tax.mTaxType === 'percentage'? Number(tax.mTaxValue).toFixed(2)+'%' : '$'+Number(tax.mTaxValue).toFixed(2) })</Typography>  
                                                    </Grid>
                                                
                                                )}

                                        </Grid>
                                        
                                        <Grid item xs={3} container justify="flex-start"  style={{padding:'10px 0 10px 10px', display:'flex', flexDirection:'row'}}>
                                            
                                            <Typography id="modal-modal-title" variant="subtitle2" align="center"><span style={{padding:'0 10px', visibility:'hidden'}}>(+)</span>${ Number(Number(row.perunit_cost) * Number(row.qty)).toFixed(2) }</Typography> 
                                                
                                            {row.ticketservicediscounts.map( (discount) =>  
                                                <Grid item xs={12} style={{padding:'5px 0'}}>
                                                        <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',}} ><span style={{padding:'0 10px'}}>(-)</span>${Number(discount.mDiscountAmount).toFixed(2) } </Typography>
                                                </Grid>
                                            )
                                            }    
                                            {row.ticketservicetaxes.map( (tax) => 
                                                <Grid item xs={12} style={{  padding:'5px 0' }}> 
                                                        <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',}}><span style={{padding:'0 10px'}}>(+)</span>${ Number(tax.mTaxAmount).toFixed(2)}</Typography> 
                                                </Grid> 
                                            )}
                                        </Grid>


                                </Grid>   
                        </Grid>
                
                })}
            </Grid>
         </Grid>
    }

}
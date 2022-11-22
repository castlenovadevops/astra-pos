import React from 'react';
import { Grid,TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import HTTPManager from '../../../../utils/httpRequestManager';

import Iconify from '../../../../components/Iconify';

import TechniciansComponent from './technicians';
import QuantityComponent from './quantity';
import PriceComponent from './price';
import ServiceNotesComponent from './specialrequest';
import DiscountsListComponent from './discounts';
import { TaxListComponent } from './taxes';
import SplitService from '../splitService';
import DialogComponent from '../../../../components/Dialog';

const getIcon = (name) => <Iconify style={{color:'#d0d0d0', marginLeft:'5px'}} icon={name} width={22} height={22} />;
export default class ServiceSideMenu extends  React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state={
            selectedRow:-1,
            menulist:[
                {id:0 , label:"Show Menu" }, 
                {id:1 , label:"Technicians" },
                {id:2 , label:"Transfer" },
                {id:3 , label:"Quantity" },
                {id:4 , label:"Change Price" },
                {id:5 , label:"Void Item" },
                {id:6 , label:"Split Item" },
                {id:7 , label:"Request" },
                {id:8 , label:"Discount" },
                {id:9 , label:"Tax" }
            ],
            search: '',
            categories:[],
            services:[]
        }
        this.onChangeTechnician = this.onChangeTechnician.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) { 
        if (nextProps.data.selectedRow !==  prevState.selectedRow) { 
            return {selectedRow: nextProps.data.selectedRow}
        }
    }

    componentDidMount(){
        this.getCategories()
    }

    getCategories(){
        this.httpManager.postRequest('merchant/category/get',{data:"GET CATEGORY"}).then(res=>{
            this.setState({categories: res.data}, ()=>{
                if(this.state.categories.length > 0){
                    this.getProductsByCategory(this.state.categories[0].id)
                }
                else{
                    this.setState({services:[]})
                }
            })
        })
    }

    onChangeTechnician(detail){
        this.props.data.onChangeTechnician(detail);
    }



    getProductsByCategory(catid){
        this.httpManager.postRequest('merchant/product/getbyCategory',{categoryId: catid}).then(res=>{
            this.setState({services: res.data})
        })
    }

    render(){
        return <Grid container style={{height:'100%'}}>
             <Grid item xs={12} style={{  width:'100%', display:'flex', flexDirection:'row'}} className='searchfld'>
                <TextField
                        fullWidth
                        variant="standard"
                        value={this.state.search}
                        onChange={(e)=>{
                            this.setState({search:e.target.value})
                        }}
                        placeholder=" Search…" 
                        InputProps={{
                        startAdornment: getIcon('mdi:magnify'),
                        endAdornment: (
                            <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="medium"
                            style={{ visibility: this.state.search ? 'visible' : 'hidden', padding:'5px' }}
                            onClick={()=>{
                                this.setState({search:''})
                            }}
                            >
                            {getIcon("mdi:close")}
                            </IconButton>
                        )
                        }} 
                    />
             </Grid>
            <Grid item xs={12} style={{height:'calc(100% - 45px)', width:'100%', display:'flex', flexDirection:'row'}}>
                <Grid item xs={4} className='sideMenu' style={{ height:'100%', overflow:'auto'}}>
                    {this.state.selectedRow !== -1 &&
                        <Grid container>
                            {this.state.menulist.map(menu=>{ 
                                return <Grid item xs={12} className={menu.id === this.props.data.selectedMenu ? 'activeSideOption sideOption':'sideOption'} onClick={()=>{
                                    this.props.data.onSelectSideMenu(menu.id)
                                }}>
                                    {menu.label}
                                </Grid> }) 
                            }
                        </Grid>
                    }
                    {this.state.selectedRow === -1 &&
                        <Grid container>
                            {this.state.categories.map(cat=>{ 
                                return <Grid item xs={12} onClick={()=>{
                                    this.getProductsByCategory(cat.id)
                                }}>
                                    {cat.mCategoryName}
                                </Grid> }) 
                            }
                        </Grid>
                    }
                </Grid>
                <Grid item xs={8} style={{borderLeft:'1px solid #dfdfdf', height:'100%', overflow:'auto'}}>

                    {this.state.selectedRow === -1 &&
                        <Grid container style={{flexWrap:'wrap'}}>
                            {this.state.services.length > 0 && this.state.services.map(service=>{ 
                                return <Grid item xs={4} className='servicebox' onClick={()=>{
                                    if(service.mProductType === 'Variable'){

                                    }
                                    else{
                                        this.props.data.onSelectService(service);
                                    }
                                }}>
                                    <div className='serviceLbl'> 
                                        {service.mProductName}
                                    </div>
                                </Grid> }) 
                            }
                            {this.state.services.length === 0 && <Grid item xs={12} className='servicebox'>
                                    <div  style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}> 
                                        No services found.
                                    </div>
                                </Grid>  
                            }
                        </Grid>
                    }
                    {
                        this.state.selectedRow !== -1 &&<div>
                            {this.props.data.selectedMenu === 1 && <TechniciansComponent data={{ 
                                onChangeTechnician: this.props.data.onChangeTechnician
                            }} />}

                            {this.props.data.selectedMenu === 3 && <QuantityComponent data={{
                                qty: this.props.data.selectedServices[this.props.data.selectedRow].qty,
                                onUpdateQuantity: this.props.data.onUpdateQuantity
                            }} />} 
                            {this.props.data.selectedMenu === 4 && <PriceComponent data={{
                                perunit_cost: this.props.data.selectedServices[this.props.data.selectedRow].perunit_cost,
                                price: this.props.data.selectedServices[this.props.data.selectedRow].originalPrice,
                                onUpdatePrice: this.props.data.onUpdatePrice
                            }} />} 
                            {this.props.data.selectedMenu === 7 &&  this.props.data.selectedServices[this.props.data.selectedRow].isSpecialRequest===1 && <ServiceNotesComponent data={{
                                serviceNotes: this.props.data.selectedServices[this.props.data.selectedRow].serviceNotes, 
                                onUpdateSpecialRequest: this.props.data.removeSpecialRequest,
                                onUpdateRequestNotes: this.props.data.onUpdateRequestNotes
                            }} />} 
                            {this.props.data.selectedMenu === 8 && <DiscountsListComponent data={{
                                selectDiscount: this.props.data.selectDiscount,
                                selectedRow: this.props.data.selectedRow,
                                selectedServices: this.props.data.selectedServices  
                            }}/>}
                            {this.props.data.selectedMenu === 9 && <TaxListComponent data={{
                                selectTax: this.props.data.selectTax,
                                selectedRow: this.props.data.selectedRow,
                                selectedServices: this.props.data.selectedServices  
                            }}/>}
                        </div>
                    }
                </Grid>
            </Grid>
            <Dialog
                                open={this.props.data.selectedMenu===5}
                                onClose={()=>{
                                    this.props.data.selectedMenu(1)
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{zIndex:'99999'}}
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Confirmation
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure to void this item?
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" onClick={()=>{
                                        this.props.data.onVoidItem()
                                    }}>Yes </Button> 
                                    <Button variant="contained" onClick={()=>{
                                        this.props.data.onSelectSideMenu(-1)
                                    }}>No </Button> 
                                </DialogActions>
                            </Dialog>


            <Dialog
                                open={this.props.data.selectedMenu===7 && this.props.data.selectedServices[this.props.data.selectedRow].isSpecialRequest===0}
                                onClose={()=>{
                                    this.props.data.selectedMenu(1)
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{zIndex:'99999'}}
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Confirmation
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure to make this as specal request?
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" onClick={()=>{
                                        this.props.data.makeSpecialRequest()
                                    }}>Yes </Button> 
                                    <Button variant="contained" onClick={()=>{
                                        this.props.data.onSelectSideMenu(-1)
                                    }}>No </Button> 
                                </DialogActions>
                            </Dialog>

                                    
                        
                            <DialogComponent open={this.props.data.selectedMenu===6} onClose={()=>{
                                this.props.data.onSelectSideMenu(1)
                            }} actions={<></>}>
                              <SplitService  data={{
                                selectedRow: this.props.data.selectedRow,
                                selectedServices: this.props.data.selectedServices ,
                                closeSplit:()=>{
                                    this.props.data.onSelectSideMenu(1)
                                },
                                onSaveSplit:this.props.data.onSaveSplit
                              }}/>
                        </DialogComponent>  

        </Grid>
    }
}
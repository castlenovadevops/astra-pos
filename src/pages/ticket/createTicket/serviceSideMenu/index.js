import React from 'react';
import { Grid,TextField, IconButton } from '@mui/material';
import HTTPManager from '../../../../utils/httpRequestManager';

import Iconify from '../../../../components/Iconify';
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
                                return <Grid item xs={12}>
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
                </Grid>
            </Grid>
        </Grid>
    }
}
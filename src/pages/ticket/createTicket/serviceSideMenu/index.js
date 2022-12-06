import React from 'react';
import { Grid,TextField,Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
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
import VariablePrice from './PriceVariable';
import TransferService from './TransferService';

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
            services:[],
            variablepopup: false,
            variableservice:{},
            transferto:{},
            confirmtransfer: false,
            transferAlert: false
        }
        this.onChangeTechnician = this.onChangeTechnician.bind(this)
        this.closePopup = this.closePopup.bind(this)
        this.afterSubmitVariablePrice = this.afterSubmitVariablePrice.bind(this)
        this.onSelectTicket= this.onSelectTicket.bind(this)
        this.transferToNewTicket = this.transferToNewTicket.bind(this)
        this.transferTicket = this.transferTicket.bind(this)
    }

    afterSubmitVariablePrice(price){
        var service = Object.assign({}, this.state.variableservice)
        service.mProductPrice = price;
        this.props.data.onSelectService(service)
        this.setState({variablepopup:false, variableservice:{}})
    }

    closePopup(){
        this.setState({variablepopup:false, variableservice:{}  })
        if(this.props.data.selectedMenu === 2){
            this.props.data.onSelectSideMenu(1)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) { 
        if (nextProps.data.selectedRow !==  prevState.selectedRow) { 
            return {selectedRow: nextProps.data.selectedRow}
        }
        return null;
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


    onSelectTicket(ticket){
        // this.httpManager.postRequest(`merchant/transfer/transferService`, {ticketDetail: ticket, service: this.props.data.selectedServices[this.props.data.selectedRow]}).then(res=>{
        //     this.props.data.afterCompleteTransfer()
        //     this.props.data.onSelectSideMenu(-1);
        //     if(this.props.data.selectedServices.length === 0){
        //         // window.location.href="/";
        //     this.props.data.voidTicket()
        //     }
        // })
        // this.props.data.onSelectSideMenu(1)
        if(this.props.data.selectedServices.length > 1){
            this.setState({transferto: ticket, confirmtransfer: true}) 
        }
        else{
            this.setState({transferAlert: true,transferto: ticket})
        }
    }

    transferTicket(){
        console.log("TRANSFERRING TICKET")
        if(this.state.transferto.ticketId !== undefined){
            console.log("TICKET TRANSFER") 
            this.httpManager.postRequest(`merchant/transfer/transferService`, {ticketDetail: this.state.transferto, service: this.props.data.selectedServices[this.props.data.selectedRow]}).then(res=>{
                this.props.data.afterCompleteTransfer()
                this.props.data.onSelectSideMenu(-1);
                if(this.props.data.selectedServices.length === 0){
                    // window.location.href="/";
                this.props.data.voidTicket()
                }
            })
        }
        else{
            console.log("ELSE TRANSFERRING TICKET")
            this.httpManager.postRequest(`merchant/transfer/createTicket`, {ticketDetail: this.props.data.ticketDetail, service: this.props.data.selectedServices[this.props.data.selectedRow]}).then(res=>{
                this.props.data.afterCompleteTransfer()
               this.props.data.onSelectSideMenu(-1);
               if(this.props.data.selectedServices.length === 0){
                //    window.location.href="/";
                this.props.data.voidTicket()
               }
            })
        }
    }
    transferToNewTicket(){
        if(this.props.data.selectedServices.length > 1){console.log("TRASFER TO NEW TICKET CALLED")
            this.httpManager.postRequest(`merchant/transfer/createTicket`, {ticketDetail: this.props.data.ticketDetail, service: this.props.data.selectedServices[this.props.data.selectedRow]}).then(res=>{
                this.props.data.afterCompleteTransfer()
                this.props.data.onSelectSideMenu(-1);
            })
        }
        else{
            this.setState({transferAlert: true,transferto: {}})
        }
        
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
                                    if(service.mProductPriceType === 'Variable'){
                                        this.setState({variableservice: service},()=>{
                                            this.setState({variablepopup: true})
                                        })
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
            {this.props.data.selectedMenu===2 && <div>SELCETED TRNASFTER</div>} 
            {this.state.variablepopup && <VariablePrice data={{
                afterSubmitVariablePrice : this.afterSubmitVariablePrice,
                closePopup: this.closePopup,
                service:this.state.variableservice 
            }} />}
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
                                    <Button color="primary" variant="contained" onClick={()=>{
                                        this.props.data.onVoidItem()
                                    }}>Yes </Button> 
                                    <Button  color="primary" variant="outlined" onClick={()=>{
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

                                    
                            <Dialog
                                style={{zIndex:'99999'}}
                                className="splitpopup"
                                open={this.props.data.selectedMenu===6}
                                onClose={()=>{
                                    this.props.data.onSelectSideMenu(1)
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Split Service
                                </DialogTitle>
                                <DialogContent> 
                                        <SplitService  data={{
                                            selectedRow: this.props.data.selectedRow,
                                            selectedServices: this.props.data.selectedServices ,
                                            closeSplit:()=>{
                                                this.props.data.onSelectSideMenu(1)
                                            },
                                            onSaveSplit:this.props.data.onSaveSplit
                                        }}/> 
                                </DialogContent> 
                            </Dialog>

                        
                            {/* <DialogComponent open={this.props.data.selectedMenu===6} onClose={()=>{
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
                        </DialogComponent>   */}


                        <DialogComponent open={this.props.data.selectedMenu===2} onClose={()=>{
                                this.props.data.onSelectSideMenu(1)
                            }} actions={<></>}>
                               <TransferService data={
                                 {
                                    onSelectTicket: this.onSelectTicket,
                                    transferToNewTicket: this.transferToNewTicket,
                                    ticketDetail: this.props.data.ticketDetail
                                }
                               } />
                        </DialogComponent> 
                        
             <Dialog
    style={{zIndex:'99999'}}
    className="lgwidth"
    open={this.state.transferAlert}
    onClose={()=>{this.props.data.onSelectSideMenu(1)}} 
>
    <DialogTitle >
        Confirmation
    </DialogTitle>
    <DialogContent> 
    <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>
                                 Transfering this service will void the existing ticket (TID - # {this.props.data.ticketDetail.ticketCode}) ?</Typography> 
    <DialogActions>
    <Button style={{marginRight: 10}} onClick={()=>this.transferTicket()} color="secondary" variant="contained">Yes</Button>
    <Button onClick={()=>{this.setState({transferAlert:false});this.props.data.onSelectSideMenu(1)}} color="secondary" variant="outlined">No</Button>
    </DialogActions>
    </DialogContent> 
</Dialog>
             

            {this.state.confirmtransfer && <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container ' style={{height:'180px', width:'500px'}}>  
                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to transfer this service to this ticket (TID - # {this.state.transferto.ticketCode}) ? </Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}> 
                                <Button style={{marginRight: 10}} onClick={()=>this.transferTicket()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>{this.setState({transferAlert:false});this.props.data.onSelectSideMenu(1)}} color="secondary" variant="outlined">No</Button>
                            </Grid> 
                        </Grid>
                </div>
            </div>   }
            

           {/* {this.state.confirmtransfer && <div className="modalbox">
                <div className='modal_backdrop'>
                </div>
                <div className='modal_container ' style={{height:'180px', width:'500px'}}> 
                    <ModalTitleBar onClose={()=>{this.props.data.closeTransfer()}} title={this.props.data.selectedRowService.servicedetail.name}/>  
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to transfer this service to this ticket (TID - # {this.state.tickettoTransfer.ticket_code}) ? </Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}> 
                                <Button style={{marginRight: 10}} onClick={()=>this.handleTransferAlert()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>this.handleCloseTransferAlert()} color="secondary" variant="outlined">No</Button>
                            </Grid> 
                        </Grid>
                </div>
            </div> } */}
                       

        </Grid>
    }
}
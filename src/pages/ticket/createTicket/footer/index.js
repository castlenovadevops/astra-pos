import React from 'react';
import { Grid, Button} from '@material-ui/core/';  
import VoidModal from './voidticket'; 
import TicketTipsModal from './TicketTips';
import PaymentModal from './TicketPayment';
import NotesModal from './notes';
// import CombineTicket from './combineticket';
import Loader from '../../../../components/Loader';
import AlertModal from '../../../../components/Dialog'; 
import TicketDiscount from './TicketDiscount'; 

export default class TicketFooterComponent extends React.Component{  
    constructor(props){
        super(props);  
        this.state = {
            isLoading: false,
            voidalertOpen: false,
            addTips_popup: false,
            addNotes_popup : false,
            notes:'',
            notesupdate: false,
            alertMsg:'',
            alertPopup: false,
            alertTitle:'',
            isCombine: false,
            discountPopup: false,
            discountsList : []
        }

        this.voidTicket = this.voidTicket.bind(this);
        this.handleCloseVoidAlert = this.handleCloseVoidAlert.bind(this);
        this.addTips = this.addTips.bind(this)
        this.handleCloseAddTips = this.handleCloseAddTips.bind(this);
        this.handleCloseTips = this.handleCloseTips.bind(this);
        this.handleTicketPayment = this.handleTicketPayment.bind(this);
        this.addNotes = this.addNotes.bind(this);
        this.handleCloseAddNotes = this.handleCloseAddNotes.bind(this);
        this.saveNotes= this.saveNotes.bind(this);
        this.saveTicket = this.saveTicket.bind(this);
        this.addDiscounts = this.addDiscounts.bind(this);
    }    

    componentDidMount(){
        if(this.props.data.ticketDetail !== undefined){
            this.setState({notes: this.props.data.ticketDetail.notes, notesupdate: false})
        } 
    }

    addDiscounts(){
        console.log("RICKET DISCOUNT CALLED")
        this.setState({discountPopup: true})
    }

    

    static getDerivedStateFromProps(nextProps, prevState){ 
        if(nextProps.data.ticketDetail.notes!==prevState.notes && !prevState.notesupdate ){
            return { notes: nextProps.data.ticketDetail.notes};
        }
        else return null;
     }
 

    handlechangeNotes(e){
        ////////console.log"handlechangeNotes",e)
        // this.setState( {notes: e, notesupdate: true})
        this.props.data.onUpdateNotes(e)
    }

    saveNotes() { 
        this.handleCloseAddNotes();
    }

    addNotes(){
        this.setState( {addNotes_popup: true})
    }
    handleCloseAddNotes(){
        this.setState( {addNotes_popup: false})
    }

    addTips(){
        this.setState( {addTips_popup: true})
    }
    handleCloseAddTips(){
        this.setState( {addTips_popup: false})
    }
    
    voidTicket(){
        this.setState({voidalertOpen : true})
    }
    handleCloseVoidAlert(){
        this.setState({voidalertOpen : false})
    }
    updateVoidTicket(){ 
        this.props.data.voidTicket(); 
    }
    isCardPaid(){ 
        if(this.props.data.ticketDetail.paymentStatus==='Paid'){  
            var isdisable = true;
            this.props.data.ticketDetail.ticketpayments.forEach(elmt=>{
                if(elmt.payMode.trim().toLowerCase() === 'card'){ 
                    isdisable = false
                }
            })
            return isdisable;
        }
        else{
        //     console.log("ELSE")
            return this.props.data.isDisabled || this.props.data.selectedServices.length === 0
        }

        // return false;
    }

    handleCloseTips(msg, tipsInput){ 
        this.props.data.handleCloseTips(msg, tipsInput)

        this.setState({addTips_popup: false});
    }

    handleTicketPayment(){ 
        if(this.props.data.selectedServices.length > 0){
            this.setState({isLoading:true})
            this.props.data.saveTicketPromise().then(r=>{
                this.setState({openPayment: true})
            })
        }
    }


    handleClosePayment(msg=''){ 
        // this.props.data.closeTicket();
        if(msg !== ''){
            this.props.data.closeTicket();
        }
        else{
            this.setState({openPayment: false})
        }
    }

    saveTicket(){
        var thisobj = this;
        var prices = this.props.data.selectedServices.map(s=>Number(s.perunit_cost));
        if(prices.indexOf(0) !== -1){
            thisobj.setState({alertPopup:true, alertMsg:"Service Price should not be empty or zero. Please try again.", alertTitle:"Error"})
        }
        else{ 
            thisobj.props.data.saveTicket('close');
        }
    }

    getOpenTicketsCombine(){
        console.log("OPEN COMBINE")
        this.setState({isCombine: true})
    }



    render(){
        var actionsbuttons = <Button onClick={()=>{
            this.setState({alertPopup: false, alertTitle:'', alertMsg:''})
        }} />
        return <> 
            <div style={{ marginLeft: 0, height:'100%'}}>
                {this.state.isLoading && <Loader />}
                {!this.props.data.isTicketEdit && <div style={{height:'100%'}}>
                    <Grid item xs={12} style={{display:'flex',height:'100%'}}>
                        <Grid item xs={5} className="footerbtn">
                            <Grid item xs={12} style={{display:'flex'}}  className='nobottomborder'>
                                <Grid xs={3}>
                                    <Button disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} fullWidth  onClick={()=>this.voidTicket()} variant="outlined">Void</Button> 
                                </Grid>
                                <Grid xs={5}>
                                    <Button disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} onClick={()=>{ 
                                    this.getOpenTicketsCombine() 
                                    }} fullWidth variant="outlined">
                                        Combine
                                    </Button> 
                                </Grid>
                                <Grid xs={4}>
                                    <Button style={{borderRadius: 0}} onClick={()=>this.addTips()} fullWidth variant="outlined" disabled={this.isCardPaid()}>
                                        Tips
                                    </Button> 
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{display:'flex'}} className='nobottomborder'>
                                <Grid xs={3}>
                                    <Button onClick={()=>{
                                        if(this.props.data.ticketDetail.paid_status === 'paid')
                                        {this.props.data.showCloseTicketPrint();} 
                                        else{this.props.data.printTicket('bill')}
                                        }}  disabled={  this.props.data.selectedServices.length === 0} fullWidth variant="outlined">
                                        Print
                                    </Button> 
                                </Grid>
                                <Grid xs={5}>
                                    <Button onClick={()=>this.addDiscounts()} fullWidth variant="outlined"  disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0}>
                                        Discount
                                    </Button> 
                                </Grid> 
                                <Grid xs={4}>
                                    <Button disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} onClick={()=>this.addNotes()} fullWidth variant="outlined" >
                                        Notes
                                    </Button> 
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={7} className="footerbtn">
                            
                            <Grid item xs={12} style={{display:'flex',height:'100%'}}> 
                                <Grid xs={6} style={{height:'100%'}}>
                                    <Button style={{background:'#134163' }} className="ticketfooterbtn" onClick={()=>this.saveTicket()} disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} color="secondary" fullWidth variant="contained"> 
                                        {this.props.data.isTicketEdit ? 'Update' : 'Save' } 
                                    </Button>
                                </Grid>
                                <Grid xs={6} style={{height:'100%'}}>
                                    <Button className='ticketfooterbtn' onClick={()=>this.handleTicketPayment()} disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} fullWidth variant="outlined">
                                        Pay
                                    </Button> 
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>}

                {this.props.data.isTicketEdit && <div style={{height:'100%'}}>
                        <Grid item xs={12} style={{display:'flex', height:'100%'}}>
                            <Grid item xs={5} className="footerbtn" >
                                <Grid item xs={12} style={{display:'flex'}} className='nobottomborder'>
                                    <Grid xs={3}><Button fullWidth onClick={()=>this.voidTicket()} variant="outlined" disabled={this.props.data.isDisabled}>Void</Button> </Grid>
                                    <Grid xs={5}><Button fullWidth disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0}  onClick={()=>{ 
                                            this.getOpenTicketsCombine()  
                                    }} variant="outlined">Combine</Button> </Grid>
                                    <Grid xs={4}><Button disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} fullWidth variant="outlined" onClick={()=>this.handleTicketPayment()} >Close</Button> </Grid>
                                </Grid>
                                <Grid item xs={12} style={{display:'flex'}}>
                                    <Grid xs={3}><Button onClick={()=>{
                                        if(this.props.data.ticketDetail.paid_status === 'paid')
                                        {this.props.data.showCloseTicketPrint();} 
                                        else{this.props.data.printTicket('bill')}
                                        }} disabled={  this.props.data.selectedServices.length === 0} fullWidth variant="outlined">Print</Button> </Grid>
                                    <Grid xs={5}><Button onClick={()=>this.addDiscounts()} fullWidth variant="outlined" disabled={this.props.data.isDisabled  || this.props.data.selectedServices.length === 0 ? true: (this.state.tipsdiscountEnabled) ? true: false}
                                    >Discount</Button> </Grid>
                                    <Grid xs={4}><Button onClick={()=>this.addNotes()} fullWidth variant="outlined" disabled={this.props.data.isDisabled  || this.props.data.selectedServices.length === 0}>Notes</Button> </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={7} style={{border:'2px solid #f0f0f0'}}>
                                <Grid item xs={12} style={{display:'flex',height:'100%'}}> 
                                    <Grid xs={4}>
                                         <Button style={{height:'100%', borderRadius:0}} disabled={!this.props.data.tipsAdjust || this.props.data.selectedServices.length === 0} onClick={()=>this.addTips()} fullWidth variant="outlined">Tips</Button> 
                                    </Grid>
                                
                                    <Grid xs={4}>
                                        <Button style={{height:'100%', borderRadius:0}} onClick={()=>this.saveTicket()} disabled={this.props.data.isDisabled || this.props.data.selectedServices.length === 0} color="secondary" fullWidth variant="contained"> Save </Button>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Button style={{height:'100%', borderRadius:0}} onClick={()=>this.handleTicketPayment()} disabled={this.props.data.isDisabled  || this.props.data.selectedServices.length === 0} fullWidth variant="outlined">Pay</Button> 
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </div>}
            </div> 
            
            {this.state.voidalertOpen && <VoidModal handleCloseVoidAlert={() => this.handleCloseVoidAlert()} updateVoidTicket={()=>this.updateVoidTicket()} 
            title="Alert" msg="Are You Sure To Void This Ticket ?"/> }  
            
             {/* Tips popup */}
            {this.state.addTips_popup &&
                <TicketTipsModal handleCloseAddTips={()=>this.handleCloseAddTips()} ticketpayments={this.props.data.ticketpayments}  afterSubmitTips={(msg,tipsInput)=>{this.handleCloseTips(msg,tipsInput); }}  selectedServices={this.props.data.selectedServices} total_tips={this.props.data.price.tipsAmount || 0}  tips_type={this.props.data.price.tips_type || 'equal'}/>
            }

 
            {this.state.openPayment && <PaymentModal  
                handleClosePayment={(msg)=>this.handleClosePayment(msg)} price={this.props.data.price} ticketDetail={this.props.data.ticketDetail}> 
            </PaymentModal>}
 
            {this.state.addNotes_popup &&
                <NotesModal handleCloseAddNotes={()=>this.handleCloseAddNotes()} notes={this.props.data.ticketDetail.ticketNotes} handlechangeNotes={(e)=>this.handlechangeNotes(e)} saveNotes={()=>this.saveNotes()}/>
            }

            {this.state.alertPopup &&  <AlertModal title={this.state.alertTitle} children={this.state.alertMsg} actionsbuttons={actionsbuttons} onClose={()=>this.setState({alertPopup:false})} open={this.state.alertPopup}/>}

            {/*this.state.isCombine && <CombineTicket data={{
                                closeCombine: ()=>{
                                    this.setState({isCombine:false})
                                },
                                closeCompletionCombine:(tickettransfered)=>{
                                    console.log("TICKET TRANSFER COMPLETION")
                                    console.log(tickettransfered)
                                    this.props.data.reloadTicket(tickettransfered)
                                }, 
                                ticketowner: this.props.data.ticketowner,
                                ticketDetail: this.props.data.ticketDetail,
                                price: this.props.data.price,
                                customer_detail: this.props.data.customer_detail,
                                selectedServices : this.props.data.selectedServices,
                                selectedRowService: this.props.selectedRowService,
                                selectedRowServiceIndex: this.props.data.selectedRowServiceIndex
                            }}/>}*/}

            {this.state.discountPopup && <TicketDiscount data={{
                ticketowner: this.props.data.selectedTech,
                ticketDetail: this.props.data.ticketDetail,
                price: this.props.data.price,
                customer_detail: this.props.data.customer_detail,  
                updateTicketDiscount: this.props.data.updateTicketDiscount,
                ticketdiscounts: this.props.data.ticketdiscounts,
                closeDiscount:()=>{
                    this.setState({discountPopup: false})
                }
            }} />} 
        </>
    }
}
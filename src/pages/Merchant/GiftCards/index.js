import React from "react";
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import HTTPManager from '../../../utils/httpRequestManager'; 
import FButton from '../../../components/formComponents/components/button';
import FMaskTextField from '../../../components/formComponents/components/masktextfield';
import FormManager from "../../../components/formComponents/FormManager";
import schema from './schema.js';
import {Box, Grid, Card,  Container, Typography, Stack} from '@mui/material'; 
import PaymentModal from "../../ticket/createTicket/footer/TicketPayment"; 

export default class GiftCards extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            cardlist:[],
            addForm: false,  
            isSellCard:false,
            showPayment: false,
            ticketDetail:{},
            price:{ 
                retailPrice:0,
                servicePrice:0,
                ticketSubTotal:0,
                ticketDiscount:0,
                taxAmount:0,
                tipsAmount:0,
                grandTotal:0
            },
            giftcard:{},
            validgiftcard:false,
            giftCardError: false,
            giftCardErrorText:'',
            giftcardnumber:''
        }
        this.handleCloseform = this.handleCloseform.bind(this);  
        this.onStateChange = this.onStateChange.bind(this);
        this.checkBalance = this.checkBalance.bind(this); 
    }

    checkBalance(){
        this.setState({giftCardError: false, giftCardErrorText: ''})
        this.httpManager.postRequest('merchant/giftcard/checkBalance', {cardNumber: this.state.giftcardnumber.replaceAll('-','')}).then(res=>{
            this.setState({giftcard: res.data, validgiftcard: true})
        }).catch(e=>{
            console.log(e)
            if(e.message){
                this.setState({giftCardError: true, giftCardErrorText: e.message})
            }
        })
    }


    onStateChange(values){ 
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        var required = Object.assign([], this.state.schema.required)
        properties.forEach((field,i)=>{
            console.log(values)

            if(values.cardType === 'Digital' && field.name === 'cardNumber'){
                field.type = "hidden";
                field.value = '';
                var idx = required.indexOf('cardNumber')
                if(idx !== -1){
                    required.splice(idx, 1)
                }
            }
            else if(values.cardType === 'Digital' && field.name === 'cardType'){
                field.grid = 12;
                field.value = values[field.name];
            }
            else if(values.cardType === 'Plastic' && field.name === 'cardNumber'){
                field.type = "text";
                field.value = '';
                if(required.indexOf('cardNumber') === -1){
                    required.push('cardNumber')
                }
            } 
            else if(values.cardType === 'Plastic' && field.name === 'cardType'){
                field.grid = 12;
                field.value = values[field.name];
            } 
            else if(values.cardType === 'Plastic' && field.name === 'hiddendiv' ){
                field.grid = 6
            }
            else if(values.cardType === 'Digital' && field.name === 'hiddendiv' ){
                field.grid = 12
            }
            else{ 
                field.value = values[field.name];
            }


            props.push(field);
            if(i === properties.length-1){ 
                schema.force = true
                console.log("FORM", JSON.stringify(required))
                schema.required = required
                schema.properties = props; 
                this.setState({schema: schema},()=>{
                    this.setState({addForm: true})
                })
            }
        })
    }

    componentDidMount(){ 
        this.setState({schema: schema},()=>{
            console.log(schema) 
        })
    }
    handleCloseform(){
        this.setState({addForm: false})
    } 
    reloadData(response){
        if(this.state.isSellCard){
            this.setState({ticketDetail:response.data,
                price:{ 
                    retailPrice:0,
                    servicePrice:0,
                    ticketSubTotal:response.data.serviceAmount,
                    ticketDiscount:0,
                    taxAmount:0,
                    tipsAmount:0,
                    grandTotal: response.data.ticketTotalAmount
                }}, ()=>{
                    this.setState({showPayment: true})
                })
        }
        else 
            this.setState({addForm: false})
        // if(msg !== ''){ 
        //     toast.dismiss();
        //     toast.success(msg, {
        //         position: "top-center",
        //         autoClose: 5000,
        //         closeButton:false,
        //         hideProgressBar: true,
        //         closeOnClick: false,
        //         pauseOnHover: false,
        //         draggable: false,
        //         progress: undefined,
        //     });
        // }
        // this.setState({isLoading: true, addForm: false},()=>{
        //     this.httpManager.postRequest(`merchant/giftcard/getCards`,{data:"FROM TALE"}).then(response=>{
        //         console.log(response)
        //         this.setState({cardlist: response.data, isLoading: false});
        //     }) 
        // })
    }
    openAdd(){
        this.setState({schema: {}},()=>{
            var schemaobj = Object.assign({}, schema); 
            var properties = Object.assign([],  schema.properties);
            var props=[];
            properties.forEach((field,i)=>{  
                console.log(field.name,"900930192090")

                field.error = false
                field.helperText = ''
                if(field.name !== 'cardType'){
                    field.value = ''  
                }
                else if(field.name === 'cardType'){
                    field.value='Digital'
                    field.grid=12
                }
                if(field.name === 'cardNumber'){
                    field.value = ''  
                    field.type = 'hidden'
                }
                if(field.name === 'cardSold' && this.state.isSellCard){
                    field.value = 1
                    field.type = 'hidden'
                }
                else if(field.name === 'cardSold' && !this.state.isSellCard){
                    field.value = 0
                    field.type = 'hidden'
                }
                if(field.name === 'hiddendiv' ){
                    field.grid = 12 
                }
                props.push(field);
                if(i === properties.length-1){
                    schemaobj.properties = props;
                }
            }); 
            schemaobj.force= true;
            this.setState({schema:schemaobj}, ()=>{
                this.setState({addForm: true}) 
            })
        })
    }

    handleClosePayment(msg){
        this.setState({showPayment: false, addForm: false})
    }
    render(){
        return <Page title="Gift Cards | Astro POS">
            {this.state.isLoading && <Loader show={this.state.isLoading} />}
            
            {!this.state.addForm &&
                <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Gift Cards
                    </Typography> 
                </Stack> 
                    <Container maxWidth="md">
                        <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={5}>  
                                <Card onClick={()=>{
                                    this.setState({isSellCard: true}, ()=>{
                                        this.openAdd()
                                    })
                                }} alignItems="center" style={{border:'1px solid #d0d0d0', width:'250px', cursor:'pointer', marginBottom:'1rem'}} >
                                    <Typography variant="h6" textAlign={'center'} p={4} gutterBottom>Sell Card</Typography>
                                </Card> 
                                <Card  alignItems="center" style={{border:0, boxShadow:'none', width:'250px', cursor:'pointer'}}>
                                    {/* <Typography variant="h6" textAlign={'center'}  p={4} gutterBottom>Check Balance</Typography> */}
                                </Card>  
                                <Card  onClick={()=>{
                                    this.setState({isSellCard: false}, ()=>{
                                        this.openAdd()
                                    })
                                }}  alignItems="center" style={{border:'1px solid #d0d0d0', width:'250px', cursor:'pointer'}}>
                                    <Typography variant="h6" textAlign={'center'}  p={4}  gutterBottom>Gift a Card</Typography>
                                </Card>   
                        </Stack> 
                    </Container>

                </Container> 
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>  
                        <Stack spacing={3}> 
                            <FormManager formProps={this.state.schema} reloadPayment={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()} formFunctions={{
                                onStateChange: this.onStateChange
                            }}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}

            <Container maxWidth="sm"> 
                <Card style={{padding:'1rem', border:'1px solid #d0d0d0'}}>
                    <Typography variant="h6" gutterBottom>
                            Check Balance
                    </Typography>
                    <Grid container spacing={2} style={{borderBottom:'1px solid #f0f0f0',  marginTop:'0.5rem'}}>
                            <Grid item xs={12} style={{display:'flex'}}> 
                                    <FMaskTextField  required={true} fullWidth error={this.state.giftCardError} helperText={this.state.giftCardErrorText} type={'text'} format={'number'} minLength={1} maxLength={16}  label={'Enter Card Number'} placeholder={'Enter Card Number'} name={'cardNumber'} value={this.state.giftcardnumber}   onChange={e=>{
                                        this.setState({giftcardnumber: e.target.value, validgiftcard: false, giftcard:{}})
                                    }}/>
                            </Grid>
                            <Grid item xs={12}>
                            {this.state.validgiftcard && this.state.giftcard.cardBalance !== undefined && <>
                                <div style={{display:'flex', flexDirection:'row', color:"#999", fontWeight:'500', padding:'10px'}}>
                                    Current Gift Card Balance : <span style={{color:'green', fontWeight:700}}>${Number(this.state.giftcard.cardBalance).toFixed(2)}</span>
                                </div> 
                            </>}
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4}>
                                <FButton fullWidth size="large" variant={'contained'} disabled={this.state.giftcardnumber.replaceAll("-","").length<16} label={"Check Balance"} onClick={()=>{
                                    this.checkBalance()
                                }
                                }/>
                            </Grid>
                            <Grid item xs={4}></Grid>
                    </Grid>
                </Card>
            </Container>

            {this.state.showPayment && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>  
                        <Stack spacing={3}> 
                            <PaymentModal  customer_detail={{}}
                                handleClosePayment={(msg)=>this.handleClosePayment(msg)} price={this.state.price} ticketDetail={this.state.ticketDetail}> 
                            </PaymentModal>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
            
    }
}
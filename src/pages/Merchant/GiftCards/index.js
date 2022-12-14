import React from "react";
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import HTTPManager from "../../../utils/httpRequestManager";   
import FormManager from "../../../components/formComponents/FormManager";
import schema from './schema.json';
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
        }
        this.handleCloseform = this.handleCloseform.bind(this);  
        this.onStateChange = this.onStateChange.bind(this);
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
                                <Card  alignItems="center" style={{border:'1px solid #d0d0d0', width:'250px', cursor:'pointer'}}>
                                    <Typography variant="h6" textAlign={'center'}  p={4} gutterBottom>Check Balance</Typography>
                                </Card>  
                                <Card  onClick={()=>{
                                    this.setState({isSellCard: false}, ()=>{
                                        this.openAdd()
                                    })
                                }}  alignItems="center" style={{border:'1px solid #d0d0d0', width:'250px', cursor:'pointer'}}>
                                    <Typography variant="h6" textAlign={'center'}  p={4}  gutterBottom>Issue Card</Typography>
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


            {this.state.showPayment && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>  
                        <Stack spacing={3}> 
                            <PaymentModal  
                                handleClosePayment={(msg)=>this.handleClosePayment(msg)} price={this.state.price} ticketDetail={this.state.ticketDetail}> 
                            </PaymentModal>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
            
    }
}
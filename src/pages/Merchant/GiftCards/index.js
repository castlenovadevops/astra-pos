import React from "react";
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import HTTPManager from "../../../utils/httpRequestManager";
import TableView from '../../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../components/Iconify';
import FormManager from "../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid, Card,  Container, Typography, Stack} from '@mui/material';
import FButton from '../../../components/formComponents/components/button';
import moment from "moment/moment";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class Discount extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            cardlist:[],
            addForm: false, 
            columns:[
                {
                    field: 'cardType',
                    headerName: 'Card Type',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div style={{textTransform:'capitalize'}}>
                            {params.row.cardType}
                        </div>
                    )
                },
                {
                    field: 'cardNumber',
                    headerName: 'Card Number',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.cardNumber}
                        </div>
                    )
                },
                {
                    field: 'cardValue',
                    headerName: 'Card Value',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div style={{textTransform:'capitalize'}}>
                            {params.row.cardValue}
                        </div>
                    )
                },
                {
                    field: 'validFrom',
                    headerName: 'Validity',
                    minWidth: 300,
                    editable: false,
                    renderCell: (params) => (
                        <div> 
                            {moment(params.row.validFrom).format('MM/DD/YYYY')} - 
                            {moment(params.row.validTo).format('MM/DD/YYYY')}
                        </div>
                    )
                },
                {
                    field: '',
                    headerName:'Actions',
                    flex:1,
                    minWidth:100,
                    renderCell: (params) => (
                        this.getActions(params)                    
                    ),
                }

            ]
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
                field.grid = 6;
                field.value = values[field.name];
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
            this.reloadData();
        })
    }
    handleCloseform(){
        this.setState({addForm: false})
    }
    getActions(params){
        var detail = window.localStorage.getItem('userdetail')
        if(detail !== '' && detail !== undefined && detail !=='{}'){
          var userdetail = JSON.parse(detail);
        return <div>      
               {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') &&  <FButton
                variant="outlined" 
                size="small" 
                onClick={()=>{
                    this.setState({isLoading:true})
                    this.httpManager.postRequest(`merchant/giftcard/disable`,{status:'Disabled', id: params.row.id}).then(r=>{
                        this.reloadData();
                    })
                }} 
                label="Disable"/>} 
            </div>
        }
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
            this.httpManager.postRequest(`merchant/giftcard/getCards`,{data:"FROM TALE"}).then(response=>{
                console.log(response)
                this.setState({cardlist: response.data, isLoading: false});
            }) 
        })
    }
    openAdd(){
        this.setState({schema: {}},()=>{
            var schemaobj = Object.assign({}, schema); 
            var properties = Object.assign([],  schema.properties);
            var props=[];
            properties.forEach((field,i)=>{  
                console.log(field.name,"900930192090")
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
            {!this.state.addForm ? 
                <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Gift Cards
                    </Typography>
                    <FButton 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Gift Card"
                    startIcon={getIcon('mdi:plus')}
                    />
                </Stack>

                <Card>
                    <TableView
                    data={this.state.cardlist} 
                    columns={this.state.columns} />
                </Card>
                </Container> : ''
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}>  
                        <Stack spacing={3}> 
                            <FormManager formProps={this.state.schema} reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()} formFunctions={{
                                onStateChange: this.onStateChange
                            }}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
            
    }
}
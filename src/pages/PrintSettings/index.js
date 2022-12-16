import React from "react";
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import HTTPManager from "../../utils/httpRequestManager";
import TableView from '../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../components/Iconify';
import schema from './schema.json'
import FormManager from "../../components/formComponents/FormManager";
import { Button } from "@mui/material";
import {Box, Grid, Card,  Container, Typography, Stack} from '@mui/material';
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class Customer extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state = {
            isLoading:false,
            printerlist:[],
            schema:{},
            columns:[
                {
                    field: 'printerName',
                    headerName: 'Printer Name',
                    minWidth:200,
                    flex:1,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.printerName === ''? '--' : params.row.printerName }
                        </div>
                    )
                }, 
                {
                    field: 'Action',
                    headerName:'Actions',
                    flex:1,
                    minWidth:100,
                    renderCell: (params) => (
                       <div>

           {/* <Button variant="contained" onClick={()=>{
                window.api.printData(params.row.printerIdentifier).then(r=>{
                    
                })
           }}>Print</Button> */}

                            <Button variant={params.row.BillPrint === 0 ? "outlined" : "contained"}  onClick={()=>{
                                this.setState({isLoading: true},()=>{      
                                    if(params.row.BillPrint === 0){
                                        this.httpManager.postRequest(`pos/print/updatePrinter`,{id: params.row.id, BillPrint:1}).then(r=>{
                                            this.reloadData()
                                        })
                                    }
                                    else{
                                        this.httpManager.postRequest(`pos/print/updatePrinter`,{id: params.row.id, BillPrint:0}).then(r=>{
                                            this.reloadData()
                                        })
                                    }
                                })
                            }}>Bill Print</Button>
                            <Button variant={params.row.ReportPrint === 0 ? "outlined" : "contained"} onClick={()=>{
                                this.setState({isLoading: true},()=>{    
                                    if(params.row.ReportPrint === 0){  
                                        this.httpManager.postRequest(`pos/print/updatePrinter`,{id: params.row.id, ReportPrint:1}).then(r=>{
                                            this.reloadData()
                                        })
                                    }
                                    else{
                                        this.httpManager.postRequest(`pos/print/updatePrinter`,{id: params.row.id, ReportPrint:0}).then(r=>{
                                            this.reloadData()
                                        })
                                    }
                                })
                            }}>Report Print</Button>
                       </div>            
                    ),
                }  
            ],
        }

        this.reloadData = this.reloadData.bind(this);
        this.handleCloseform = this.handleCloseform.bind(this);

        this.openAdd = this.openAdd.bind(this);
    }

    openAdd(){
        var addedprinters= this.state.printerlist.map(r=>r.printerIdentifier)
        window.api.getPrinters().then(data=>{ 
            var printers = data.printers.filter(r=>addedprinters.indexOf(r.name) === -1)
            var props = [];
            props = schema.properties.map(field=>{
                if(field.name === 'printerIdentifier'){
                    field.data = printers;
                    field.dataformat = {
                        label:'displayName',
                        value:'name'
                    }
                } 
                return field;
            })
            schema.properties = props;
            schema.force = true;
            this.setState({schema: schema, addForm: true}, ()=>{
            })
        })       
    }

    componentDidMount(){
        this.setState({isLoading: false},()=>{
             window.api.getPrinters().then(data=>{ 
                var props = [];
                props = schema.properties.map(field=>{
                    if(field.name === 'printerIdentifier'){
                        field.data = data.printers;
                        console.log(field.data)
                        field.dataformat = {
                            label:'displayName',
                            value:'name'
                        }
                    } 
                    if(field.name === 'Title'){
                        var mstr = window.localStorage.getItem('merchantdetail')
                        var mdetail = JSON.parse(mstr);
                        field.value = mdetail.merchantName
                    }
                    return field;
                })
                schema.properties = props;
                schema.force = true;
                this.setState({schema: schema}, ()=>{
                    console.log(this.state.schema);
                    this.reloadData()
                })
            })
        })
           
    }

    reloadData(){ 
        this.httpManager.postRequest(`pos/print/getPrinters`,{data:"FOM PRINTER"}).then(res=>{
            this.setState({printerlist: res.data, isLoading: false, addForm: false})
        })
    }
    
    handleCloseform(){
        this.setState({addForm: false})
    }

    render(){
        return <Page title="Printer Settings | Astro POS">
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
                    Printers
                    </Typography>
                    <Button 
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained" 
                    startIcon={getIcon('mdi:plus')}
                    >Add Printer</Button>
                </Stack>

                <Card>
                    <TableView
                    data={this.state.printerlist} 
                    columns={this.state.columns} />
                </Card>
                </Container> : ''
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                    <Grid item xs={12}> 
                        <Stack spacing={3}> 
                            <FormManager formProps={this.state.schema}  reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
    }

}
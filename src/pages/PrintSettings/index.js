import React from "react";
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import HTTPManager from "../../utils/httpRequestManager";
import TableView from '../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../components/Iconify';
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
                            <Button onClick={()=>{
                                console.log("Assign Clicked")
                            }}>Assign</Button>
                       </div>            
                    ),
                }  
            ],
        }
    }

    componentDidMount(){
        console.log("PRINT MANAGEENT")
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
                            {/* <FormManager formProps={this.state.schema}  reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()}/> */}
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
            </Page>
    }

}
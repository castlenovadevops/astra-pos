/* eslint-disable no-useless-constructor */
import React from 'react'; 
import {Box, Grid, Typography, Button} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import LoadingModal from '../../components/Loader';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HTTPManager from '../../utils/httpRequestManager';
import socketIOClient from "socket.io-client"; 

const ENDPOINT = "http://localhost:1818";

export default class SyncProgress extends React.Component{
    httpManager = new HTTPManager();
    socket = socketIOClient(ENDPOINT);
    constructor(props){
        super(props);
        this.state = {
            progress: 0,
            isLoading: false,
            isFinished: false,
            downloadinMessage: '',
            isOnline: false,
            merchantDetail: {},
            mastertables: [],
            runningIndex:0
        }
    }

    componentDidMount(){
        this.socket.on("startSync", data => {
            this.setState({progress:10, runningIndex:0}, ()=>{
                this.syncAllData();
            })
        });

        this.socket.on("resetSync", data=>{
            window.location.href="/"
        })

        this.socket.on("stopSync", ()=>{
            window.location.href="/"
        })
        

        let detail = window.localStorage.getItem("merchantDetail");
        this.setState({ merchantDetail: JSON.parse(detail) })
        // console.log("did mount")
        this.setState({mastertables:[
            
            {
                name: "merchantEmployees",
                tablename: 'merchantEmployees',
                progressText: "Synchronizing Staff details...",
                progresscompletion: 10,
                url:  `/pos/syncData/employees`
            } ,
            {
                name: "mCustomers",
                tablename: 'mCustomers',
                progressText: "Synchronizing Customers...",
                progresscompletion: 10,
                url:  `/pos/syncData/getCustomers`
            },
            {
                name: "mCategory",
                tablename: 'mCategory',
                progressText: "Synchronizing Categories...",
                progresscompletion: 10,
                url:  `/pos/syncData/category`
            },
            {
                name: "mProducts",
                tablename: 'mProducts',
                progressText: "Synchronizing Products/Services...",
                progresscompletion: 10,
                url:  `/pos/syncData/products`
            } ,
            {
                name: "mDefaultDiscountDivision",
                tablename: 'mDefaultDiscountDivision',
                progressText: "Synchronizing Default Discount Division Settings...",
                progresscompletion: 10,
                url:  `/pos/syncData/defaultDiscountDivision`
            } ,
            {
                name: "mDefaultCommission",
                tablename: 'mDefaultCommission',
                progressText: "Synchronizing Default Commission Settings...",
                progresscompletion: 10,
                url:  `/pos/syncData/defaultCommission`
            } ,
            {
                name: "mDiscounts",
                tablename: 'mDiscounts',
                progressText: "Synchronizing Discounts...",
                progresscompletion: 10,
                url:  `/pos/syncData/discounts`
            } ,
            
            // {
            //     name: "default_commission",
            //     tablename: 'default_commission',
            //     progressText: "Synchronizing Commission...",
            //     progresscompletion: 10,
            //     url: config.root + `/settings/default_commission/list/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:''
            // } , 
            // {
            //     name: "default_discount_division",
            //     tablename: 'default_discount_division',
            //     progressText: "Synchronizing Discount Division...",
            //     progresscompletion: 10,
            //     url: config.root + `/settings/default_discount/list/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:''
            // } ,

            // {
            //     name: "employee_salary",
            //     tablename: 'employee_salary',
            //     progressText: "Synchronizing Salary Division...",
            //     progresscompletion: 10,
            //     url: config.root + `/settings/employee_salary/list/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:''
            // } ,
            {
                name: "mTax",
                tablename: 'mTax',
                progressText: "Synchronizing Taxes...",
                progresscompletion: 10,
                url:  `/pos/syncData/tax`
            } ,
            // {
            //     name: "customers",
            //     tablename: 'customers',
            //     progressText: "Synchronizing Customers...",
            //     progresscompletion: 10,
            //     url: config.root + `/customer/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/customer/saveorupdate'
            // },
            // {
            //     name: "discounts",
            //     tablename: 'discounts',
            //     progressText: "Synchronizing Discounts...",
            //     progresscompletion: 10,
            //     url: config.root + `/discount/list/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/discount/saveorupdate'
            // },
            // {
            //     name: "services",
            //     tablename: 'services',
            //     progressText: "Synchronizing Services...",
            //     progresscompletion: 10,
            //     url: config.root + `/inventory/servicesbybusiness/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/inventory/services/saveorupdate'
            // } ,
            // {
            //     name: "services_category",
            //     tablename: 'services_category',
            //     progressText: "Synchronizing Services...",
            //     progresscompletion: 10,
            //     url: config.root + `/inventory/servicescategory/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/inventory/services/category/saveorupdate'
            // } ,
            // {
            //     name: "services_tax",
            //     tablename: 'services_tax',
            //     progressText: "Synchronizing Services...",
            //     progresscompletion: 10,
            //     url: config.root + `/inventory/servicestax/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/inventory/services/tax/saveorupdate'
            // },
            // {
            //     name: "ticket",
            //     tablename: 'ticket',
            //     progressText: "Synchronizing Ticket...",
            //     progresscompletion: 10,
            //     url: config.root + `/ticket/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/ticket/saveorupdate'
            // } ,
            // {
            //     name: "ticket_services",
            //     tablename: 'ticket_services',
            //     progressText: "Synchronizing Tickets...",
            //     progresscompletion: 10,
            //     url: config.root + `/ticket/allservices/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/ticket/service/saveorupdate'
            // } ,
            // {
            //     name: "ticketservice_taxes",
            //     tablename: 'ticketservice_taxes',
            //     progressText: "Synchronizing Tickets...",
            //     progresscompletion: 10,
            //     url: config.root + `/ticket/alltaxes/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/ticket/tax/saveorupdate'
            // },
            // {
            //     name: "ticketservice_requestnotes",
            //     tablename: 'ticketservice_requestnotes',
            //     progressText: "Synchronizing Tickets...",
            //     progresscompletion: 10,
            //     url: config.root + `/ticket/allnotes/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/ticket/service/saveorupdatenotes'
            // },
            // {
            //     name: "ticket_payment",
            //     tablename: 'ticket_payment',
            //     progressText: "Synchronizing Tickets...",
            //     progresscompletion: 10,
            //     url: config.root + `/ticket/payments/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/ticket/payment/saveorupdate'
            // },
            // {
            //     name: "employee_commission_detail",
            //     tablename: 'employee_commission_detail',
            //     progressText: "Synchronizing Tickets...",
            //     progresscompletion: 10,
            //     url: config.root + `/ticket/empcommission/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/employee_commission/save'
            // },
            // {
            //     name: "emp_payment",
            //     tablename: 'emp_payment',
            //     progressText: "Synchronizing Tickets...",
            //     progresscompletion: 10,
            //     url: config.root + `/payment/getPayments/` + JSON.parse(window.localStorage.getItem('merchantDetail')).id,
            //     syncurl:'/payment/savePayment'
            // },
            // {
            //     name: "staff_clockLog",
            //     tablename: 'staff_clockLog',
            //     progressText: "Synchronizing Logs...",
            //     progresscompletion: 10,
            //     url:'',
            //     syncurl:'/employee/synclog'
            // }
        ]}, ()=>{
            
            var condition = navigator.onLine ? 'online' : 'offline';
            this.setState({ isOnline: (condition == "online") ? true : false }, function () {
                if (this.state.isOnline) {
                    this.syncAllData();
                }
            }) 
        })
    }
    
    syncAllData(){
        if(this.state.runningIndex< this.state.mastertables.length){
            this.setState({downloadinMessage: this.state.mastertables[this.state.runningIndex].progressText})
            this.httpManager.postRequest(this.state.mastertables[this.state.runningIndex].url, {data:"TAX"}).then(res=>{
                this.setState({runningIndex: this.state.runningIndex+1}, ()=>{
                    this.syncAllData();
                })
            }).catch(e=>{

            })
        }
        else{
            this.setState({progress:100}, ()=>{
                this.socket.emit('resetSync', {data:"Completed"})
            })
        }
    }

    renderOfflineContent() {
        return (<div style={{ height: '100%' }}>
            {/* {this.state.isLoading && <LoaderContent show={this.state.isLoading}></LoaderContent>} */}
             
            <div style={{ height: '100%' }}>
                 
                <Grid container spacing={3} style={{ height: 'calc(100% - 104px)', padding: 0 }}>
                    <Grid item xs={12} style={{ height: '100%', paddingRight: 0 }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <img style={{ height: '100px' }} alt="offline" src="./static/icons/offline.png" />
                            <Typography variant="h4" style={{ color: "#ccc" }}>You are offline.</Typography>
                            <Typography variant="subtitle2" style={{ color: "#ccc", marginBottom: '1rem' }}>Please try again later.</Typography>
                            <Button variant="contained" onClick={()=>{
                                var condition = navigator.onLine ? 'online' : 'offline';
                                this.setState({ isOnline: (condition === "online") ? true : false }, function () {
                                    if (this.state.isOnline) {
                                        this.syncAllData();
                                    }
                                }) 
                                }}>Reload</Button>
                        </div>

                    </Grid>
                </Grid>

            </div></div>
        );
    }

    renderMain() {

        return (


            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>

                {this.state.isLoading && <LoadingModal show={this.state.isLoading}></LoadingModal>}


                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Grid container spacing={2} >

                        <Grid item xs={2}> </Grid>
                        <Grid item xs={8}>
                            {/* <Grid item xs={12}><Typography variant="h6" noWrap >Please wait until finish..</Typography> </Grid> */}
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12} style={{ marginTop: 20, display: 'flex' }}>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="determinate" value={this.state.progress} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: 10 }}><Typography variant="subtitle2" noWrap style={{ color: '#808080' }}> {this.state.downloadinMessage}...</Typography> </Grid>
                            <Grid item xs={12}><Typography variant="subtitle2" noWrap style={{ color: ' #808080' }}></Typography> </Grid>

                        </Grid>
                        <Grid item xs={2}> </Grid>
                    </Grid>

                </div>



            </div>
        )

    }

    render() {
        var content = this.renderMain()
        if (!this.state.isOnline) {
            content = this.renderOfflineContent()
        }

        return (<>
            {this.state.isOnline && this.renderMain()}
            {!this.state.isOnline && this.renderOfflineContent()}
            </>
        )
    }
}
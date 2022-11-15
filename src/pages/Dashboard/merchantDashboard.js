import React from "react";
import { Button, Grid } from "@mui/material";
import AppCard from "../../components/dashboard.js/AppCard";
import Loader from "../../components/Loader";
import Iconify from '../../components/Iconify';
import HTTPManager from "../../utils/httpRequestManager";
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class MerchantDashboard extends React.Component{
    httpmanager = new HTTPManager();
    constructor(){
        super();
        this.state={
            userdetail:{},
            requestNewBusiness: false,
            isLoading: false,
            businessMetrics: {}
        }
        this.loadData = this.loadData.bind(this);
        this.getBusinessMetrics = this.getBusinessMetrics.bind(this);
    }
    componentDidMount(){ 
        this.loadData()
    }

    loadData(){

        var details = window.localStorage.getItem("userdetail") || ''
        if(details !== ''){
            this.setState({userdetail: JSON.stringify(details)}, ()=>{
                this.getBusinessMetrics();
            })
        }
    }

    getBusinessMetrics(){
        this.setState({isLoading: true}, ()=>{
            this.httpmanager.getRequest(`/merchant/getMetrics`).then(response=>{
                console.log(response.data)
                if(response.data.customerCount !== undefined){
                    this.setState({businessMetrics:response.data, isLoading: false}, ()=>{
                        console.log(this.state.businessMetrics)
                    })
                }
                else{ 
                this.setState({isLoading:false, businessMetrics:{
                    customerCount: 0,
                    empCount: 0,
                    itemsCount:0,
                    categoryCount:0
                }})
                }
            }).catch(e=>{
                this.setState({isLoading:false, businessMetrics:{
                    customerCount: 0,
                    empCount: 0,
                    itemsCount:0,
                    categoryCount:0
                }})
            })
        })
    }

    render(){
        return <div> 
            {!this.state.requestNewBusiness && <><div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'end'}}>
                <Button variant="contained" onClick={()=>{
                    this.setState({requestNewBusiness: true})
                }}>Request New Business</Button>
            </div></>}
            {this.state.isLoading && <Loader />}
           {!this.state.isLoading && <Grid container><Grid item xs={12} sm={6} md={3}>
          <AppCard Icon={getIcon("mdi:account-group")} Text="Customers" background={"#D0F2FF"}  value={this.state.businessMetrics.customerCount}/> 
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
          <AppCard Icon={getIcon("mdi:sitemap")} Text="Categories" background={"#E9FCD4"}   value={this.state.businessMetrics.categoryCount}/> 
              {/* <AppCategory  value={this.state.businessMetrics.categorycount}/> */}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
          <AppCard Icon={getIcon("mdi:cash")} Text="Item Orders" background={"#FFF7CD"}   value={this.state.businessMetrics.itemsCount}/>  
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
          <AppCard Icon={getIcon("mdi:account-box")} Text="Employees" background={"rgb(255, 231, 217)"}  value={this.state.businessMetrics.empCount}/>  
            </Grid>
            </Grid>} 
        </div>
    }
}
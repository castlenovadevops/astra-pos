import React from "react";
import MerchantDashboard from './merchantDashboard'; 
// import AutoSync from "../../autoSync";
import AutoBatchComponent from "../../autoBatch";
export default class Dashboard extends React.Component{
    constructor(){
        super();
        this.state={
            userdetail:{}
        }
    }
    componentDidMount(){
        // console.log("DASHBOARD COMPONENT")
        var details = window.localStorage.getItem("userdetail") || ''
        if(details !== ''){
            this.setState({userdetail: JSON.parse(details)})
        }

        window.api.getPrinters().then(data=>{
            console.log("RESULT ::::: ", data)
        })
    }
    render(){
        return  <> 
        <MerchantDashboard style={{height:'100%'}}/> 
        {/* <AutoBatchComponent/> */}
        {/* {window.localStorage.getItem('batchTime') !== undefined && window.localStorage.getItem('batchTime') !== '' && <AutoSync batchtime={(window.localStorage.getItem('batchTime') || '55 23')+' * * *'}/>}  */}
        </>
    }
}
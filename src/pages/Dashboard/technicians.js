/* eslint-disable no-useless-constructor */
import React from "react";
import { Button, Grid, Typography } from "@mui/material"; 
import HTTPManager from "../../utils/httpRequestManager";

import socketIOClient from "socket.io-client"; 

const ENDPOINT = "http://localhost:1818";

export default class Technicians extends React.Component{
    httpManager = new HTTPManager();
    socket = socketIOClient(ENDPOINT);
    constructor(props){
        super(props);
        this.state = {
            clockedInEmps:[],
            clockedOutEmps: [],
            refreshData:false
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.refreshData !== prevState.refreshData){
            return {refreshData: nextProps.refreshData}
        }
        else{
            return null;
        }
    }

    componentDidMount(){
        // console.log("SOCKETTTTTT")
        // console.log(this.socket)
        this.socket.on("refreshTechnicians", data => {
            // console.log("SOCKET REFRESHHHHH")
            this.getData();
        });

        this.socket.emit("refreshTechnicians", {data:"success"})

        this.getData()
    }

    getData(){
        this.httpManager.postRequest('merchant/employee/getTechnicians', {type:"clockedin"}).then(res=>{
            this.setState({clockedInEmps: res.data}); 
            this.httpManager.postRequest('merchant/employee/getTechnicians', {type:"clockedout"}).then(res=>{
                this.setState({clockedOutEmps: res.data}); 
                this.props.onCompleteRefresh()
            })
        })
    }

    renderEmpNames(data, color){
        var empBox = []
        data.forEach(emp=>{
            empBox.push(<Grid className='techbtn'  item xs={4} style={{padding:'10px 5px', background:"",paddingRight: 2,paddingLeft: 2, paddingTop:2,paddingBottom:2,  height:65,cursor:'pointer'}}> 
            <div style={{background: color,borderBottom: '0px solid #bee1f7', borderRadius: 10, display:'flex',alignItems:'center', justifyContent:'center', }} 
            onDoubleClick={()=>{
                    //  this.setState({ticketowner:staff})
                    //  this.handleOpenClockin()
            }}>
            <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%',overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}}>
            <Typography
              variant="subtitle2"
              component="h2"
              overflow="hidden"    
              textOverflow="ellipsis"
              display='-webkit-box'
              align="center"
              style={{display:'flex',alignItems:'center', justifyContent:'center', verticalAlign: 'middle',background:"", textAlign: 'center', width: '100%',height: 60,marginLeft:2,marginRight:2, overflow:'hidden' , wordWrap: "break-word" ,textOverflow: "ellipsis", WebkitLineClamp: 3, WebkitBoxOrient: ''}}  
            >
            {emp.mEmployeeFirstName+" "+emp.mEmployeeLastName}
            </Typography>
            </div>
             

            </div>
            </Grid>)
        })
        return empBox;
    }

    render(){
        return <Grid container className='dashboardTechnician'>

            {this.state.refreshData && this.getData()}
            <Grid item xs={6}>
                <Typography gutterBottom align="center" variant="subtitle1" className="techTitle">
                    Clocked In Technicians
                </Typography>
                <div style={{height:'calc(100% - 60px)'}}>
                    <Grid container>
                        <Grid item xs={12} style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                            {this.renderEmpNames(this.state.clockedInEmps, '#bee1f7')}
                        </Grid>
                    </Grid>
                </div>
            </Grid> 
            <Grid item xs={6}>
                <Typography gutterBottom align="center" variant="subtitle1" className="techTitle">
                    Technicians
                </Typography>
                <div style={{height:'calc(100% - 60px)'}}>
                    <Grid container>
                        <Grid item xs={12} style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                            {this.renderEmpNames(this.state.clockedOutEmps, '#C4CDD5')}
                        </Grid>
                    </Grid>
                </div>
            </Grid> 
        </Grid>
    }
}
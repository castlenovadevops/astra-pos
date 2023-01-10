import React from "react";
import HTTPManager from "./utils/httpRequestManager";
import schedule from "node-schedule"; 
export default class AutoBatchComponent extends React.Component{
    httpManager = new HTTPManager();
    scheduleJob = schedule.scheduleJob('* * * * *', () => {});

    constructor(props){
        super(props)
        this.state = {
            isRunning: false
        }
    }

    componentDidMount(){
        var batchtime = (window.localStorage.getItem('batchTime') || '55 23')+' * * *'
        console.log("BATCH TIME" , `${batchtime}`)
        // this.scheduleJob.cancel();
        this.scheduleJob = schedule.scheduleJob(
        `${batchtime}`, 
        () => {
            if(!this.state.isRunning){
                this.setState({isRunning: true})
                this.httpManager.postRequest("/merchant/batch/autoBatch", {data:"FROM AUTO BATCH"}).then(res=>{    
                    this.setState({isRunning: false})
                    console.log('job ran on schedule complete!');
                })
            }
                console.log('job ran on schedule!');
        },
        );
    }

    render(){
        return <></>
    }
}
// routes
import Router from './routes'; 
// theme
import ThemeProvider from './theme';
import { Dialog, DialogActions, DialogContent, Button } from '@mui/material';
// components
import ScrollToTop from './components/ScrollToTop';
// import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { deviceDetect } from 'react-device-detect';
// ---------------- ------------------------------------------------------
import HTTPManager from './utils/httpRequestManager';
import React from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css'; 
import { 
  IdleTimerProvider, 
  IdleTimerConsumer, 
  IIdleTimerContext, 
  IdleTimerContext,
  useIdleTimerContext
} from 'react-idle-timer'
import AutoSync from './autoSync';

import Socket from './socket';
import SyncProgress from './pages/syncData/syncProgress'; 
import dayjs from 'dayjs'; 

export default class App extends React.Component{
  httpManager = new HTTPManager();

  constructor(){
    super();
    this.state={
      syncData: false,
      openCloseDialog: false,
      batchtime:'55 23 * * *'
    }

    this.onPrompt=this.onPrompt.bind(this)
    this.onIdle=this.onIdle.bind(this)
    this.onAction=this.onAction.bind(this)
    this.onActive=this.onActive.bind(this)
    this.onLoginPrompt=this.onLoginPrompt.bind(this)
    this.onLoginIdle=this.onLoginIdle.bind(this)
    this.onLoginAction=this.onLoginAction.bind(this)
    this.onLoginActive=this.onLoginActive.bind(this)
    this.getBatchSettleTime = this.getBatchSettleTime.bind(this)
  }

  onPrompt(){
    // Fire a Modal Prompt
  }

  onIdle(){
    // Close Modal Prompt
    // Do some idle action like log out your user
    this.setState({syncData: true})
  }

  onActive(event){
    // Close Modal Prompt
    // Do some active action
  }

  onAction(event){
    // Do something when a user triggers a watched event
  }


  onLoginPrompt(){
    // Fire a Modal Prompt
  }

  onLoginIdle(){
    // Close Modal Prompt
    // Do some idle action like log out your user
    var str = window.localStorage.getItem('userdetail') || ''
    if(str !== ''){
      this.httpManager.postRequest('/merchant/employee/clockout', {data:"LOGOUT ALL"}).then(res=>{
        window.localStorage.removeItem('userdetail');
        // window.reload()
        window.location.href="/"
      })
    }
  }

  onLoginActive(event){
    // Close Modal Prompt
    // Do some active action
  }

  onLoginAction(event){
    // Do something when a user triggers a watched event
  }

  updateBatch(){ 
    this.setState({autobatch:false}, ()=>{
      setTimeout(() => {
          this.setState({autobatch: true}, ()=>{
            this.updateBatch()
          })
      }, 100);
    })
  }

  componentDidMount(){ 
    window.api.on("closecalled",(e)=>{
      this.setState({openCloseDialog: true})
    }) 

    // this.updateBatch()
    window.api.on("appOpen", (e)=>{
      // window.localStorage.removeItem('userdetail')
      var str = window.localStorage.getItem('userdetail') || ''
      if(str !== ''){
        var userdetail = JSON.parse(str)
        this.httpManager.postRequest(`/merchant/employee/clocklog`, {passCode: userdetail.mEmployeePasscode}).then(res=>{
          window.localStorage.removeItem('userdetail'); 
          window.location.href="/"
        })
      }

      this.httpManager.postRequest(`/merchant/batch/autobatchprevday`, {fromdate:dayjs(new Date().toISOString()).add(-1,'day').format("YYYY-MM-DD")}).then(r=>{
        console.log(r)
      })
    })
    var accessToken=window.localStorage.getItem('accessToken') || '' 
    if(accessToken === ''){ 
      this.httpManager.postRequest(`common/getToken`, deviceDetect(window.navigator.userAgent)).then(response=>{ 
        // console.log("REOPNSE")
        // console.log(response)
        window.localStorage.setItem('accessToken', response.token) 
        this.getBatchSettleTime()
        toast.success(response.message,  {
            position: "top-center",
            autoClose: 5000,
            closeButton:false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        })
      }).catch(error=>{ 
        // console.log(error);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          closeButton:false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
      });
      })
    } 
    else{
      console.log("MOUNT CALLED")
      this.getBatchSettleTime();
    }
  }

  getBatchSettleTime(){
    console.log("SETLE CALLED")
    var thisobj = this;
    this.httpManager.postRequest("pos/syssettings/getSettingsByFeature", {feature:'batchsettle', status:1}).then(res=>{
      if(res.data !== null){
          if(res.data.value.split(":") instanceof Array){
              if(res.data.value.split(":").length === 2){
                  var tmp = res.data.value.split(":")  
                  window.localStorage.setItem('batchTime', (tmp[1]+" "+tmp[0]).trim())
                  thisobj.setState({batchtime: tmp[1]+" "+tmp[0]+" * * *"}, ()=>{ 
                      console.log(this.state.batchtime)
                  })
              }
          }
      }
      else{ 
        this.setState({batchtime:'55 23 * * *'})
      }
  })
  }

  render(){
    return ( 
        <ThemeProvider>
          <ScrollToTop /> 

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

<IdleTimerProvider
            timeout={30 * 1000 * 60}
            onPrompt={this.onLoginPrompt}
            onIdle={this.onLoginIdle} 
            onActive={this.onLoginActive}
            onAction={this.onLoginAction}
                  >
            <AutoSync batchtime={this.state.batchtime}/>
                  {/* {this.state.syncData && <div style={{'visibility':'hidden'}}><SyncProgress afterSyncComplete={()=>{
                      this.setState({syncData:false})
                    }} /></div>} */}
                  <Socket />
            <Router /> 

            {this.state.openCloseDialog && <Dialog open={this.state.openCloseDialog}>
                    <DialogContent>
                        Your are trying to close the app. Are you sure to continue?
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={()=>{
                          window.api.closeWindow().then(r=>{

                          })
                      }} variant={"contained"}> Yes </Button> 
                      <Button onClick={()=>{
                          this.setState({openCloseDialog: false})
                      }} variant={"outlined"}> No </Button>
                    </DialogActions>
                  </Dialog>
                    }

            </IdleTimerProvider>
        </ThemeProvider> 
    );
  }
}

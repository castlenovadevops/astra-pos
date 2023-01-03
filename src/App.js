// routes
import Router from './routes'; 
// theme
import ThemeProvider from './theme';
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

import Socket from './socket';
import SyncProgress from './pages/syncData/syncProgress'; 

export default class App extends React.Component{
  httpManager = new HTTPManager();

  constructor(){
    super();
    this.state={
      syncData: false
    }

    this.onPrompt=this.onPrompt.bind(this)
    this.onIdle=this.onIdle.bind(this)
    this.onAction=this.onAction.bind(this)
    this.onActive=this.onActive.bind(this)
    this.onLoginPrompt=this.onLoginPrompt.bind(this)
    this.onLoginIdle=this.onLoginIdle.bind(this)
    this.onLoginAction=this.onLoginAction.bind(this)
    this.onLoginActive=this.onLoginActive.bind(this)
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
        window.reload()
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

  componentDidMount(){ 
    var accessToken=window.localStorage.getItem('accessToken') || '' 
    if(accessToken === ''){ 
      this.httpManager.postRequest(`common/getToken`, deviceDetect(window.navigator.userAgent)).then(response=>{ 
        // console.log("REOPNSE")
        // console.log(response)
        window.localStorage.setItem('accessToken', response.token) 
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
            <IdleTimerProvider
            timeout={15 * 1000 * 60}
            onPrompt={this.onPrompt}
            onIdle={this.onIdle} 
            onActive={this.onActive}
            onAction={this.onAction}
                  >
                  {this.state.syncData && <div style={{'visibility':'hidden'}}><SyncProgress afterSyncComplete={()=>{
                      this.setState({syncData:false})
                    }} /></div>}
                  <Socket />
            <Router />
            </IdleTimerProvider>



            </IdleTimerProvider>
        </ThemeProvider> 
    );
  }
}

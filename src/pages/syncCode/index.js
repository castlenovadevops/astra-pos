import React from "react";  
import LoadingModal from '../../components/Loader';
import CommonModal from '../../components/Dialog';
import { styled } from '@mui/material/styles';
import { Typography, Grid, TextField, Button, Container, Paper, Card } from '@mui/material';
import { deviceDetect } from 'react-device-detect';
import HTTPManager from "../../utils/httpRequestManager"; 
import { Wifi } from "@mui/icons-material"; 
import Iconify from '../../components/Iconify';
const get = require('get-value')
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'start',
    },
  })); 
  
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
  })); 
const section = {
  height: '100%',
  marginTop: 10, 
  display:'flex', 
  justifyContent:'center', 
  alignItems:'center',  
  width:'50%'
};
export default class App extends React.Component {
    httpManager = new HTTPManager();

  constructor(props) {
    super(props);
    this.state = { 
      code:'',
      isSynced: false,
      syncData: "",
      msg : '',
      currentDateTime: new Date(),
      openDialog: false,
      isLoading: false,
      backupOption: false,
      deviceSelection: false, 
      devicesList: [],
      response: {},
      showDevices: false
    } 

    this.swapDevice = this.swapDevice.bind(this)
  }

  swapDevice(obj){
    console.log(this.state.response)
    this.setState({isLoading: true}, ()=>{
        this.httpManager.postRequest(`/pos/swapdevice`,{fromDevice:obj , toDevice:this.state.response.merchantdetail.device}).then(res=>{ 
            var merchantdetail = Object.assign({},  this.state.response.merchantdetail)
            merchantdetail.device = res.device
            window.localStorage.setItem('merchantdetail', JSON.stringify(merchantdetail))
            window.localStorage.setItem('devicetoken', res.devicetoken)
            window.location.href = "/syncData/progress"
        })
    })
  }

  componentDidMount(){  

  }


  handleCloseDialog(){
    this.setState({openDialog: false})
  } 

  onSubmit(){ 
    if(this.state.code.trim() !== ''){
      this.setState({isLoading: true})

      this.setState({deviceslist: [], backupOption: false, response:{}})
      if(navigator.onLine) {
        this.httpManager.postRequest(`/pos/checkSyncCode`,{syncCode:this.state.code, deviceDetails:deviceDetect(window.navigator.userAgent)}).then(res=>{
            this.setState({ isLoading: false})
            console.log(res.devices)
            var devicemacs = [];
            var deviceslist = [];
            if(res.devices.length === 0){
                window.localStorage.setItem('merchantdetail', JSON.stringify(res.merchantdetail))
                window.localStorage.setItem('devicetoken', res.devicetoken)
                window.location.href = "/syncData/progress"
            }
            else{  
                res.devices.forEach((d,i)=>{
                    var dobj = JSON.parse(d.deviceMAC) 
                    let anpi0 = get(dobj, 'anpi0.mac')
                    let anpi1 = get(dobj, 'anpi1.mac')
                    var en1 = get(dobj, 'en1.mac') 
                    let Ethernet = get(dobj, 'Ethernet.mac')
                    var WiFi = get(dobj, 'Wi-Fi.mac') 
                    // if(devicemacs.indexOf(anpi0) === -1 && devicemacs.indexOf(anpi1) === -1 &&
                    // devicemacs.indexOf(en1) === -1 && devicemacs.indexOf(awdl0) === -1 
                    // && devicemacs.indexOf(llw0) === -1 && devicemacs.indexOf(utun0) === -1 &&
                    // devicemacs.indexOf(utun1) === -1 && devicemacs.indexOf(Ethernet) === -1 &&
                    // devicemacs.indexOf(WiFi) === -1 )
                    if(devicemacs.indexOf(anpi0) === -1 || devicemacs.indexOf(anpi1) === -1 ||
                    devicemacs.indexOf(en1) === -1 ||   devicemacs.indexOf(Ethernet) === -1 ||
                    devicemacs.indexOf(WiFi) === -1){
                        var ispushed = 0;
                        if(devicemacs.indexOf(anpi0) === -1){
                            d.installs = 1
                            deviceslist.push(d);
                            ispushed =1 
                            devicemacs.push(anpi0)
                        }
                        if(devicemacs.indexOf(anpi1) === -1){
                            if(ispushed === 0){ 
                                d.installs = 1
                                deviceslist.push(d);
                            }
                            devicemacs.push(anpi1)
                        }
                        if(devicemacs.indexOf(en1) === -1){
                            if(ispushed === 0){ 
                                d.installs = 1
                                deviceslist.push(d);
                            }
                            devicemacs.push(en1)
                        } 
                        if(devicemacs.indexOf(Ethernet) === -1){
                            if(ispushed === 0){ 
                                d.installs = 1
                                deviceslist.push(d);
                            }
                            devicemacs.push(Ethernet)
                        }
                        if(devicemacs.indexOf(Wifi) === -1){
                            if(ispushed === 0){ 
                                d.installs = 1
                                deviceslist.push(d);
                            }
                            devicemacs.push(Wifi)
                        } 
                    }
                    else{
                        var lst = [];
                        deviceslist.forEach((deviceobj, j)=>{
                            if(get(deviceobj, 'anpi0.mac') === anpi0 || get(deviceobj, 'anpi1.mac')=== anpi1||
                                get(deviceobj, 'en1.mac') === en1 || get(deviceobj, 'Ethernet.mac') === Ethernet ||
                                get(deviceobj, 'Wi-Fi.mac') === WiFi){
                            
                                deviceobj.installs = Number(deviceobj.installs) + Number(1)
                            }
                            lst.push(deviceobj)
                            if(j === deviceslist.length-1){
                                deviceslist = Object.assign([], lst)
                            }
                        })
                    }
                    if(i === res.devices.length -1){
                        if(deviceslist.length > 0){
                            this.setState({deviceslist: deviceslist, backupOption: true, response: res})
                        }
                        else{
                            window.localStorage.setItem('merchantdetail', JSON.stringify(res.merchantdetail))
                            window.localStorage.setItem('devicetoken', res.devicetoken)
                            window.location.href = "/syncData/progress"
                        }
                    }
                }) 
            }
        }).catch(e=>{
            this.setState({msg: e.message, openDialog: true, isLoading: false})
        }) 
      }
      else {
        this.setState({msg:"Please check your internet connection before syncing", openDialog: true, isLoading: false})
      }
      
    }
    else{
      this.setState({msg:"Please enter the code", openDialog: true})
    }
  }




  keyPress(e){ 
    if(e.which === 13){
      this.onSubmit() 
    }
 }

  render() {
    return (  
        <RootStyle title="Business Registration | Astro POS">  
        <Container maxWidth="sm" style={{padding:0}}>
              <ContentStyle className="mobileminauto">               
                <Typography style={{padding:0}}>
                  <img alt="Astro POS" src="/static/icons/logo-450.png"  className='logoimg'
                                    style={{ objectFit: 'cover', maxWidth:'100%'}}/>
                </Typography> 
              </ContentStyle>
      </Container> 

            <Container maxWidth="sm">
                <ContentStyle className="mobileminautoform">    
                    <div>
                        {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>} 
                        <div>   
                            {!this.state.backupOption && <div  style={{display:'flex', justifyContent:'center', alignItems:'flex-start', flexDirection:'column', width:'100%'}}>
                            <Grid item xs={9} style={{display:'flex', justifyContent:'center', alignItems:'flex-start', flexDirection:'column'}}> 
                                <Grid item ><Typography variant="h6" noWrap > Enter Your Sync Code</Typography> </Grid> 
                                <Grid item  style={{marginTop: 20,display:'flex' }}>
                                    <TextField id="code" label="Sync Code" type="text" value={this.state.code} onKeyPress={e=>{this.keyPress(e);}} onChange={(val) => { 
                                    if(val.target.value.match("^.{7,7}$")==null) {
                                        this.setState({code: val.target.value.toUpperCase()})}
                                    } 
                                    } 
                                    />
                                    <Button  
                                        size="medium"
                                        variant="contained"
                                        style={{marginLeft:'10px', color:'#fff'}}
                                        onClick={()=>this.onSubmit()} 
                                    >Submit</Button>
                                </Grid>
                                <Grid item  style={{marginTop: 10}}><Typography variant="subtitle2" noWrap style={{color:'#808080'}}> This is your secret code for your business.</Typography>
                                <Typography variant="subtitle2" noWrap style={{color:' #808080'}}> You can get this code from your given login credentials.</Typography> </Grid> 

                            </Grid>
                            </div> }
                            {this.state.backupOption && !this.state.showDevices && <div  style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:'50%'}}>
                                <Card className="bckopt" onClick={()=>{
                                    window.localStorage.setItem('merchantdetail', JSON.stringify(Object.assign({},this.state.response.merchantdetail)))
                                    window.localStorage.setItem('devicetoken', this.state.response.devicetoken)
                                    window.location.href = "/syncData/progress"
                                }}>New</Card>
                                <Card className="bckopt" onClick={()=>{
                                    this.setState({showDevices: true})
                                }}>Backup Device</Card> 
                            </div>}

                            {this.state.backupOption && this.state.showDevices && <div  style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', width:'100%',  flexWrap:'wrap'}}>
                                {this.state.deviceslist.map(c=> {
                                    return <Card style={{cursor:'pointer', border:'1px solid #999',flexDirection:'column', flexWrap:'wrap',width:'calc(50% - 20px)', margin:'10px', display:'flex', height:'150px', alignItems:'center', justifyContent:'center'}} onClick={()=>{
                                        this.swapDevice(c)
                                    }}>
                                        <div>{getIcon('mdi:laptop')}</div>
                                        <div>{c.deviceName}</div>
                                        <div style={{fontSize:'13px', color:'#999'}}>No.Of installs: {c.installs}</div>
                                    </Card>}
                                )}
                            </div>}

                            <CommonModal className="giftcardpopup" open={this.state.openDialog} onClose={()=>this.handleCloseDialog()} title="Error"><div>{this.state.msg}</div></CommonModal>
                        </div>  
                    </div>
                </ContentStyle>
            </Container>
        </RootStyle> 
    )
  }
}
// import { filter } from 'lodash';
import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers'; 
import Page from '../../components/Page';
import * as Moment from 'moment';
import Close from '@mui/icons-material/Close';
import {CalendarTodayOutlined as CalendarMonthIcon} from '@mui/icons-material';
// material
import { Button,Grid,IconButton,Chip, Select, FormControl,InputLabel, Input, MenuItem,Checkbox, DialogContentText,RadioGroup, FormLabel,FormControlLabel,Radio, DialogActions, Card, Stack, Container,TextField, Typography,Dialog,DialogTitle,DialogContent } from '@mui/material';  
import LoaderContent from '../../components/Loader';
 import HTTPManager from '../../utils/httpRequestManager';
 import NumberPad from '../../components/numberpad';
 import './tabs.css';

 const ITEM_HEIGHT = 48;
 const ITEM_PADDING_TOP = 8;
 const MenuProps = {
     PaperProps: {
       style: {
         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
         width: 250,
       },
     },
   };
export default class ReportComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props) {
        super(props);
         this.state = {
            employee_reportlist:[], 
            from_date:new Date(),
            to_date:new Date(),
            reportType:'Owner',
            reportPeriod:'Daily',
            tabName:'Owner',
            empReport:[],
            isAuthenticated : false,
            userDetail:{},
            discounts:[],
            showFormError: false,
            formError:'',
            owner:{},
            payments:[],
            employees:[]
         }

         this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
         this.handlechangeToDate = this.handlechangeToDate.bind(this);
         this.submiteReport = this.submiteReport.bind(this)
         this.handleChangeCode = this.handleChangeCode.bind(this); 
         this.getEmpDetail = this.getEmpDetail.bind(this);
         this.formatOwnerReport = this.formatOwnerReport.bind(this)
         this.handleType = this.handleType.bind(this)
    } 

    handleType(e){
        this.setState({reportPeriod:e.target.value});
    }

    handleChangeCode(passcode){

        if(passcode === "remove") {
          this.setState({passcode: passcode});
        }
        else if(passcode.length === 4) {
            const stringData = passcode.reduce((result, item) => {
                return `${result}${item}`
            }, "")
  
            this.setState({passcode: stringData});
        }
    }
    getEmpDetail(passcode){
        const stringData = passcode.reduce((result, item) => {
            return `${result}${item}`
        }, "")
  
        this.httpManager.postRequest(`/merchant/employee/getByPasscode`, {passCode: stringData}).then(res=>{
            if(res.data.mEmployeeId !== undefined){
                if(res.data.mEmployeeRoleName === 'Admin' || res.data.mEmployeeRoleName === 'Owner'){
                    this.setState({isAuthenticated: true, userDetail: res.data});

                    this.getReports()
            }
                else{
                    this.setState({showFormError:true, formError:"You are not authorized to view the report."})
                }

            }
            else{
                this.setState({showFormError:true, formError:res.message})
                this.clearPasscode()
            }
        }).catch(e=>{
          // console.log(e)
                this.setState({showFormError:true, formError:e.message})
                this.clearPasscode()
          
        })
    }

    handlechangeFromDate(e){
        this.setState({from_date: e});
    }
    handlechangeToDate(e){
        this.setState({to_date: e});
    }
    submiteReport() {
        this.getReports();        
    }


    componentDidMount(){
    }

    getTotalDiscounts(data){

        var total = 0
        data.forEach(e=>{
            total = Number(total)+Number(e.discountAmount)
        })

        return total.toFixed(2)
    }


    getEmpTotalDiscounts(data){
        console.log(data)
        var total = 0
        data.forEach(e=>{
            total = Number(total)+Number(e.discountAmount)
        })

        return total.toFixed(2)
    }

    getTotalAmountcollected(){
        var total = 0
        this.state.payments.forEach(e=>{
            total = Number(total)+Number(e.paymentAmount)
        })

        return total.toFixed(2)
    }
    getReports(){
        if(this.state.tabName === 'Owner'){
            this.httpManager.postRequest('merchant/report/getReport', {type:this.state.tabName, reportPeriod: this.state.reportPeriod ,from_date: this.state.from_date, to_date: this.state.to_date}).then(res=>{
                console.log(res)
                this.setState({payments: res.payments, owner: res.owner,discounts: res.discounts})
                this.formatOwnerReport(res.data,{
                    addedDates:[],
                    data:[]
                })
            })
        }
        else{
            this.httpManager.postRequest('merchant/report/getEmpReport', {type:this.state.tabName, reportPeriod: this.state.reportPeriod ,from_date: this.state.from_date, to_date: this.state.to_date}).then(res=>{
                // console.log(res)
                this.formatEmployeeData(res.data, []) 
            })
        }
    }   

    formatEmployeeData(data,response, i=0){
        console.log("DATA CALLLING")
        if(i < data.length){
            var obj = {
                addedDates:[],
                data:[],
                discounts:data[i].discounts,
                empdetail: data[i].emp
            } 
            this.formatEmployeeReport(data, data[i].report, response, obj,i,  0)
        }
        else{
            this.setState({employees: response}, ()=>{
                console.log(this.state.employees)
            })
        }

    }

    formatOwnerReport(data,response, i=0){ 
        console.log(data.length)
        if(i< data.length){
            var rec = data[i]
            if(response.addedDates.indexOf(rec.created) === -1){ 
                var obj = {
                    ticketCount:1,
                    servicesCount: rec.ServiceCount,
                    serviceTotal: rec.TotalServiceAmount,
                    tips: rec.Tips,
                    discount: rec.Discount,
                    date: rec.created
                }
                response.data.push(obj);
                response.addedDates.push(obj.date);
                this.formatOwnerReport(data, response, i+1)
            }
            else{
                var idx = response.addedDates.indexOf(rec.created)
                var obj  = Object.assign({}, response.data[idx]);
                obj = {
                    ticketCount:obj.ticketCount+1,
                    servicesCount: Number(obj.servicesCount)+Number(rec.ServiceCount),
                    serviceTotal: Number(obj.serviceTotal)+Number(rec.TotalServiceAmount),
                    tips: Number(obj.tips)+Number(rec.Tips),
                    discount: Number(obj.discount)+Number(rec.Discount),
                    date: obj.date
                }
                response.data[idx] = obj;
                this.formatOwnerReport(data, response, i+1)
            }
        }   
        else{
            this.setState({employee_reportlist: response.data}, ()=>{
                // console.log("EMP REPOTR", this.state.employee_reportlist)
            })
        }
    }



    formatEmployeeReport(emps,data,response, empobj, ei ,i=0){ 
        if(i< data.length){
            var rec = data[i]
            if(empobj.addedDates.indexOf(rec.created) === -1){ 
                var obj = {
                    ticketCount:1,
                    servicesCount: rec.ServiceCount,
                    serviceTotal: rec.TotalServiceAmount,
                    tips: rec.Tips,
                    discount: rec.Discount,
                    date: rec.created
                }
                empobj.data.push(obj);
                empobj.addedDates.push(obj.date);
                this.formatEmployeeReport(emps, data, response, empobj,ei, i+1)
            }
            else{
                var idx = empobj.addedDates.indexOf(rec.created)
                var obj  = Object.assign({}, empobj.data[idx]);
                obj = {
                    ticketCount:obj.ticketCount+1,
                    servicesCount: Number(obj.servicesCount)+Number(rec.ServiceCount),
                    serviceTotal: Number(obj.serviceTotal)+Number(rec.TotalServiceAmount),
                    tips: Number(obj.tips)+Number(rec.Tips),
                    discount: Number(obj.discount)+Number(rec.Discount),
                    date: obj.date
                }
                response.data[idx] = obj;
                this.formatEmployeeReport(emps, data, response, empobj, ei, i+1)
            }
        }   
        else{ 
            response.push(empobj)
            this.formatEmployeeData(emps,  response, ei+1);
        }
    }

    getDiscountAmount(option){
        var disamt = '0.00';
        this.state.discounts.map((d, i)=>{
            if(d.mDiscountDivisionType === option && d.discountAmount){ 
                disamt = d.discountAmount ? Number(d.discountAmount).toFixed(2)  : '0.00'
            }  
        })
        return disamt; 
    }

    renderOwnerReport(){ 
        var reportdetail = [];
        var mstr = window.localStorage.getItem('merchantdetail');
        var merchantdetail = mstr !== undefined && mstr !== '' ? JSON.parse(mstr) : {}

        reportdetail.push(<div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <Typography variant="h4">{merchantdetail.merchantName}</Typography>
                <Typography variant="h5" style={{textTransform:'capitalize'}}>Owner Report</Typography>
                <Typography variant="subtitle2" style={{textTransform:'capitalize', fontWeight:'400'}}>{Moment(this.state.from_date).format("MM/DD/YYYY")+" - "+Moment(this.state.to_date).format("MM/DD/YYYY")}</Typography>
            </div>);

        reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>Owner : <b>{this.state.userDetail.mEmployeeFirstName+" "+this.state.userDetail.mEmployeeLastName}</b></Typography>
        </div>) 
        if(this.state.employee_reportlist.length > 0){
        // if(this.state.empReport.length > 0){
            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
                <Grid container>
                    <Grid item xs={2}><b>{this.state.reporttype === 'annually' ? 'Year' : (this.state.reporttype === 'monthly') ? 'Month' : 'Date'}</b></Grid>
                    <Grid item xs={2}><b>Tickets</b></Grid>
                    <Grid item xs={2}><b>Service</b></Grid>
                    <Grid item xs={2}><b>Amount</b></Grid>
                    <Grid item xs={1}><b>Tip</b></Grid>
                    <Grid item xs={1}><b>Discount</b></Grid>
                    <Grid item xs={2}><b>Total</b></Grid>
                </Grid>
            </div>)
            var totalServicePrice = 0
            var totalTips = 0
            var discounttotal = 0
            var totalAmount = 0

            this.state.employee_reportlist.forEach(t=>{ 
                totalServicePrice =Number(totalServicePrice)+Number(t.serviceTotal);
                totalTips =Number(totalTips)+Number(t.tips);
                console.log(totalTips, Number(totalTips),"+",Number(t.tips))
                totalAmount =Number(totalAmount)+Number(t.serviceTotal)+Number(t.tips)-Number(t.discount);
                discounttotal =Number(discounttotal)+Number(t.discount);
                reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000', padding:'2px 0'}}> 
                    <Grid container>
                        <Grid item xs={2}>{t.date}</Grid>
                        <Grid item xs={2} >{t.ticketCount} </Grid>
                        <Grid item xs={2} >{t.servicesCount} </Grid>
                        <Grid item xs={2}>{Number(t.serviceTotal) > 0 ? "$"+Number(t.serviceTotal).toFixed(2) : '-' }</Grid>
                        <Grid item xs={1}>{Number(t.tips) > 0 ? "$"+Number(t.tips).toFixed(2) : '-' }</Grid>
                        <Grid item xs={1}>{Number(t.discount) > 0 ? "$"+Number(t.discount).toFixed(2) : '-' }</Grid>
                        <Grid item xs={2}>{(Number(t.serviceTotal)+Number(t.tips)-Number(t.discount)) > 0 ? "$"+(Number(t.serviceTotal)+Number(t.tips)-Number(t.discount)).toFixed(2) : '-' }</Grid>
                    </Grid>
                </div>)
            })   
            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                <Grid container>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}><b>Total</b></Grid>
                    <Grid item xs={2}><b>{"$"+Number(totalServicePrice).toFixed(2)}</b></Grid>
                    <Grid item xs={1}><b>{"$"+Number(totalTips).toFixed(2)}</b></Grid>
                    <Grid item xs={1}><b>{"$"+Number(discounttotal).toFixed(2)}</b></Grid>
                    <Grid item xs={2}><b>{"$"+Number(totalAmount).toFixed(2)}</b></Grid>
                </Grid>
            </div>)

            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'column', marginTop:'2rem'}}>

                    <Typography variant="h6" style={{textTransform:'capitalize', fontWeight:'700'}}>Discounts</Typography>

                    {/* <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>#</Grid>
                        <Grid item xs={4}>{Number(discounttotal).toFixed(2)}</Grid>
                    </Grid> */}

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner</Grid>
                        <Grid item xs={4}>{this.getDiscountAmount('Owner')}
                        </Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Employee</Grid>
                        <Grid item xs={4}>{this.getDiscountAmount('Employee')}
                        </Grid>
                    </Grid>
                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner & Employee</Grid>
                        <Grid item xs={4}>{this.getDiscountAmount('Both')}
                        </Grid>
                    </Grid>

                    {/* <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Employee</Grid>
                        <Grid item xs={4}>{Number(this.state.empReport[0].discountdata.EmpDiscount).toFixed(2)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner & Employee</Grid>
                        <Grid item xs={4}>{Number(this.state.empReport[0].discountdata.OwnerEmpDiscount).toFixed(2)}</Grid>
                    </Grid> */}
                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',}}>
                        <Grid item xs={8}>Total</Grid>
                        <Grid item xs={4}>${this.getTotalDiscounts(this.state.discounts)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Tax Amount</Grid>
                        <Grid item xs={4}>${this.state.owner.TotalTax!== null ? Number(this.state.owner.TotalTax).toFixed(2) : "0.00"}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Supplies</Grid>
                        <Grid item xs={4}>${this.state.owner.Supplies!== null ? Number(this.state.owner.Supplies).toFixed(2) : "0.00"}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Payment Methods</Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                    
                    {this.state.payments.map(csh=>{
                    return <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                        <Grid item xs={8}>{csh.paymentType !== '' ? csh.paymentType : 'Cash'}</Grid>
                        <Grid item xs={4}>${Number(csh.paymentAmount).toFixed(2)}</Grid>
                    </Grid> })}

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',marginTop:10}}>
                        <Grid item xs={8}>Amount Collected</Grid>
                        <Grid item xs={4}>${this.getTotalAmountcollected()}</Grid>
                    </Grid> 
                </div>)
        }
        else{ 
            reportdetail.push(<div style={{display:'flex',marginTop:'1rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
                <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>No tickets made during this time period by {this.state.userDetail.mEmployeeFirstName+" "+this.state.userDetail.mEmployeeLastName}</Typography>
            </div>) 
        }

        reportdetail.push(<div style={{display:'flex',marginTop:'1.5rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
            <Typography variant="body" style={{ paddingBottom:'1rem',fontWeight:'400'}}>{merchantdetail.merchantName} - Reported: {Moment().format("MM/DD/YYYY hh:mm a")}</Typography>
        </div>) 

        return  <div style={{borderBottom:'1px dotted #000', paddingBottom:'1rem', width:'100%'}}>
            {reportdetail}
            </div>;
    }
    getEmpDiscountAmount(emp,option){
        var disamt = '0.00';
        emp.discounts.map((d, i)=>{
            if(d.mDiscountDivisionType === option && d.discountAmount){ 
                disamt = d.discountAmount ? Number(d.discountAmount).toFixed(2)  : '0.00'
            }  
        })
        return disamt; 
    }


    renderEmployeeReport(){ 
        var reportdetail = [];
        var mstr = window.localStorage.getItem('merchantdetail');
        var merchantdetail = mstr !== undefined && mstr !== '' ? JSON.parse(mstr) : {}
    this.state.employees.forEach(emp=>{
        reportdetail.push(<div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <Typography variant="h4">{merchantdetail.merchantName}</Typography>
                <Typography variant="h5" style={{textTransform:'capitalize'}}>Employee Report</Typography>
                <Typography variant="subtitle2" style={{textTransform:'capitalize', fontWeight:'400'}}>{Moment(this.state.from_date).format("MM/DD/YYYY")+" - "+Moment(this.state.to_date).format("MM/DD/YYYY")}</Typography>
            </div>);

        reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>Employee : <b>{emp.empdetail.mEmployeeFirstName+" "+emp.empdetail.mEmployeeLastName}</b></Typography>
        </div>) 
        if(emp.data.length > 0){
        // if(this.state.empReport.length > 0){
            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
                <Grid container>
                    <Grid item xs={2}><b>{this.state.reporttype === 'annually' ? 'Year' : (this.state.reporttype === 'monthly') ? 'Month' : 'Date'}</b></Grid>
                    <Grid item xs={2}><b>Tickets</b></Grid>
                    <Grid item xs={2}><b>Service</b></Grid>
                    <Grid item xs={2}><b>Amount</b></Grid>
                    <Grid item xs={2}><b>Tip</b></Grid> 
                    <Grid item xs={2}><b>Total</b></Grid>
                </Grid>
            </div>)
            var totalServicePrice = 0
            var totalTips = 0
            var discounttotal = 0
            var totalAmount = 0

             emp.data.forEach(t=>{ 
                totalServicePrice =Number(totalServicePrice)+Number(t.serviceTotal);
                totalTips =Number(totalTips)+Number(t.tips);
                console.log(totalTips, Number(totalTips),"+",Number(t.tips))
                totalAmount =Number(totalAmount)+Number(t.serviceTotal)+Number(t.tips)-Number(t.discount);
                discounttotal =Number(discounttotal)+Number(t.discount);
                reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000', padding:'2px 0'}}> 
                    <Grid container>
                        <Grid item xs={2}>{t.date}</Grid>
                        <Grid item xs={2} >{t.ticketCount} </Grid>
                        <Grid item xs={2} >{t.servicesCount} </Grid>
                        <Grid item xs={2}>{Number(t.serviceTotal) > 0 ? "$"+Number(t.serviceTotal).toFixed(2) : '-' }</Grid>
                        <Grid item xs={2}>{Number(t.tips) > 0 ? "$"+Number(t.tips).toFixed(2) : '-' }</Grid> 
                        <Grid item xs={2}>{(Number(t.serviceTotal)+Number(t.tips)-Number(t.discount)) > 0 ? "$"+(Number(t.serviceTotal)+Number(t.tips)-Number(t.discount)).toFixed(2) : '-' }</Grid>
                    </Grid>
                </div>)
            })   
            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                <Grid container>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}><b>Total</b></Grid>
                    <Grid item xs={2}><b>{"$"+Number(totalServicePrice).toFixed(2)}</b></Grid>
                    <Grid item xs={1}><b>{"$"+Number(totalTips).toFixed(2)}</b></Grid>
                    <Grid item xs={1}><b>{"$"+Number(discounttotal).toFixed(2)}</b></Grid>
                    <Grid item xs={2}><b>{"$"+Number(totalAmount).toFixed(2)}</b></Grid>
                </Grid>
            </div>)

            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'column', marginTop:'2rem'}}>

                    <Typography variant="h6" style={{textTransform:'capitalize', fontWeight:'700'}}>Discounts</Typography> 

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner</Grid>
                        <Grid item xs={4}>{this.getEmpDiscountAmount(emp,'Owner')}
                        </Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Employee</Grid>
                        <Grid item xs={4}>{this.getEmpDiscountAmount(emp,'Employee')}
                        </Grid>
                    </Grid>
                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner & Employee</Grid>
                        <Grid item xs={4}>{this.getEmpDiscountAmount(emp,'Both')}
                        </Grid>
                    </Grid> 

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',}}>
                        <Grid item xs={8}>Total</Grid>
                        <Grid item xs={4}>${this.getEmpTotalDiscounts(emp.discounts)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Tax Amount</Grid>
                        <Grid item xs={4}>${emp.empdetail.TotalTax!== null ? Number(emp.empdetail.TotalTax).toFixed(2) : "0.00"}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Supplies</Grid>
                        <Grid item xs={4}>${emp.empdetail.Supplies!== null ? Number(emp.empdetail.Supplies).toFixed(2) : "0.00"}</Grid>
                    </Grid>

                    {/* <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Payment Methods</Grid>
                        <Grid item xs={4}></Grid>
                    </Grid> */}
                    
                    {/* {this.state.payments.map(csh=>{
                    return <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                        <Grid item xs={8}>{csh.paymentType !== '' ? csh.paymentType : 'Cash'}</Grid>
                        <Grid item xs={4}>${Number(csh.paymentAmount).toFixed(2)}</Grid>
                    </Grid> })} */}

                    {/* <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',marginTop:10}}>
                        <Grid item xs={8}>Amount Collected</Grid>
                        <Grid item xs={4}>${this.getTotalAmountcollected()}</Grid>
                    </Grid>  */}
                </div>)
        }
        else{ 
            reportdetail.push(<div style={{display:'flex',marginTop:'1rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
                <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>No tickets made during this time period by {this.state.userDetail.mEmployeeFirstName+" "+this.state.userDetail.mEmployeeLastName}</Typography>
            </div>) 
        }

        reportdetail.push(<div style={{borderBottom:'1px dotted #000',display:'flex',marginTop:'1.5rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
            <Typography variant="body" style={{ paddingBottom:'1rem',fontWeight:'400'}}>{merchantdetail.merchantName} - Reported: {Moment().format("MM/DD/YYYY hh:mm a")}</Typography>
        </div>) 
    });

        return  <div style={{ paddingBottom:'1rem', width:'100%'}}>
            {reportdetail}
            </div>;
    }
    // renderEmployeeReport(){
    //     var reportdetail = [];
    //     this.state.empReport.forEach(emp=>{ 
    //         reportdetail.push(<div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
    //             <Typography variant="h4">{this.state.businessdetail.name}</Typography>
    //             <Typography variant="h5" style={{textTransform:'capitalize'}}>Employee {this.state.reporttype} Report</Typography>
    //             <Typography variant="subtitle2" style={{textTransform:'capitalize', fontWeight:'400'}}>{Moment(this.state.from_date).format("MM/DD/YYYY")+" - "+Moment(this.state.to_date).format("MM/DD/YYYY")}</Typography>
    //         </div>);

    //         reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
    //                 <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>Employee : <b>{emp.firstName+" "+emp.lastName}</b></Typography>
    //         </div>) 
    //         if(emp.tickets.length > 0){
    //             reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
    //                 <Grid container>
    //                     <Grid item xs={3}><b>{this.state.reporttype === 'annually' ? 'Year' : (this.state.reporttype === 'monthly') ? 'Month' : 'Date'}</b></Grid>
    //                     <Grid item xs={3}><b>Tickets</b></Grid>
    //                     <Grid item xs={2}><b>Amount</b></Grid>
    //                     <Grid item xs={2}><b>Tip</b></Grid>
    //                     <Grid item xs={2}><b>Total</b></Grid>
    //                 </Grid>
    //             </div>)
    //             var discounttotal = 0
    //             var totalAmount = 0;
    //             var totalTips = 0;
    //             emp.tickets.map(t=>{
    //                 return  reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000', padding:'2px 0'}}> 
    //                     <Grid container>
    //                         <Grid item xs={3}>{t.ticket_date}</Grid>
                            
    //                         <Grid item xs={3} style={{alignItems:'center', display:'flex', textDecoration:'underline', cursor:'pointer'}} onClick={()=>{
    //                             this.showDetails(t)
    //                         }}>{t.ticketcount}</Grid>
    //                         <Grid item xs={2}>{Number(t.Amount) > 0 ? "$"+Number(t.Amount).toFixed(2) : '-' }</Grid>
    //                         <Grid item xs={2}>{Number(t.Tips) > 0 ? "$"+Number(t.Tips).toFixed(2) : '-' }</Grid>
    //                         <Grid item xs={2}>{Number(t.Amount)+Number(t.Tips) > 0 ? "$"+(Number(t.Tips)+Number(t.Amount)).toFixed(2) : '-' }</Grid>
    //                     </Grid>
    //                 </div>)
    //             })

    //             emp.tickets.forEach(t=>{
    //                 discounttotal = discounttotal+ Number(t.Discount);
    //                 totalAmount = totalAmount+ Number(t.Amount);
    //                 totalTips = totalTips+ Number(t.Tips);
    //                 discounttotal = discounttotal+ Number(t.Discount);
    //             })

    //             discounttotal = emp.discountdata.OwnerDiscount+emp.discountdata.EmpDiscount+emp.discountdata.OwnerEmpDiscount;
    //             console.log(discounttotal);

    //             reportdetail.push(
    //                 <div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000',fontWeight:'700', padding:'2px 0'}}> 
    //                     <Grid container><Grid item xs={3}></Grid>
    //                         <Grid item xs={3}>Total</Grid>
    //                         <Grid item xs={2}>{Number(totalAmount) > 0 ? "$"+Number(totalAmount).toFixed(2) : '-' }</Grid>
    //                         <Grid item xs={2}>{Number(totalTips) > 0 ? "$"+Number(totalTips).toFixed(2) : '-' }</Grid>
    //                         <Grid item xs={2}>{Number(totalTips)+Number(totalAmount) > 0 ? "$"+(Number(totalTips)+Number(totalAmount)).toFixed(2) : '-' }</Grid>
    //                     </Grid>
    //                 </div>)
    //             reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'column', marginTop:'2rem'}}>

    //                     <Typography variant="h6" style={{textTransform:'capitalize', fontWeight:'700'}}>Discounts</Typography>

    //                     <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
    //                         <Grid item xs={8}>#</Grid>
    //                         <Grid item xs={4}>{Number(discounttotal).toFixed(2)}</Grid>
    //                     </Grid>
    //                     <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
    //                         <Grid item xs={8}>Owner</Grid>
    //                         <Grid item xs={4}>{Number(emp.discountdata.OwnerDiscount).toFixed(2)}</Grid>
    //                     </Grid>

    //                     <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
    //                         <Grid item xs={8}>Employee</Grid>
    //                         <Grid item xs={4}>{Number(emp.discountdata.EmpDiscount).toFixed(2)}</Grid>
    //                     </Grid>

    //                     <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
    //                         <Grid item xs={8}>Owner & Employee</Grid>
    //                         <Grid item xs={4}>{Number(emp.discountdata.OwnerEmpDiscount).toFixed(2)}</Grid>
    //                     </Grid>
    //                     <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',}}>
    //                         <Grid item xs={8}>Total</Grid>
    //                         <Grid item xs={4}>${Number(discounttotal).toFixed(2)}</Grid>
    //                     </Grid>

    //                     <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
    //                         <Grid item xs={8}>Supplies</Grid>
    //                         <Grid item xs={4}>$0.00</Grid>
    //                     </Grid> 
    //                 </div>)
    //         }
    //         else{ 
    //             reportdetail.push(<div style={{display:'flex',marginTop:'1rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
    //                 <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>No tickets made during this time period by {emp.firstName+" "+emp.lastName}</Typography>
    //             </div>) 
    //         }

    //         reportdetail.push(<div style={{display:'flex',marginTop:'1.5rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row',borderBottom:'1px dotted #000', marginBottom:'1rem'}}> 
    //             <Typography variant="body" style={{ paddingBottom:'1rem',fontWeight:'400'}}>{this.state.businessdetail.name} - Reported: {Moment().format("MM/DD/YYYY hh:mm a")}</Typography>
    //         </div>) 
    //     })
    //     return  <div style={{ width:'100%'}}>
    //         {reportdetail}
    //         </div>;

    // }


    render(){
        return(
            <Page title="Report | Astro POS">
                 {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}  
                {this.state.isAuthenticated &&  <Card style={{  position:'absolute',top:64, left:0, right:0, bottom:0, zIndex:'999'}}>
                            <div className="tab">
                                {/* {this.state.restrictionmode === 'Owner' &&  */}
                                
                                <button className={this.state.tabName === 'Owner' ? "active tablinks": "tablinks"} 
                                onClick={()=>{
                                    // 
                                    this.setState({tabName:'Owner'}, function(){
                                        this.getReports()
                                    })
                                }} >Owner Report</button>

                                <button className={this.state.tabName === 'Employee' ? "active tablinks": "tablinks"} onClick={()=>{
                                    this.setState({tabName:'Employee'}, function(){
                                        this.getReports()
                                    })
                                }} >Employee Report</button> 
                            </div>
                            {this.state.tabName === 'Owner' &&  
                            <div  class="tabcontent">
                                    <Grid container  style={{marginTop:'1rem', maxHeight:'80px'}}>
                                            <Grid item xs={12} md={8}> 
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
 
                                                    <IconButton onClick={()=>{
                                                        this.setState({showDatePopup: true})
                                                    }}><CalendarMonthIcon/></IconButton>
                                                </div>
                                            </Grid>
                                    </Grid> 

                                    <Grid container  style={{marginTop:'1rem'}}>
                                            <Grid item xs={12} md={12}>
                                                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'2rem 5rem'}}>  
                                                 {this.state.employee_reportlist.length > 0 && this.renderOwnerReport()} 
                                                {this.state.employee_reportlist.length === 0 && !this.state.isLoading  && <div><Typography variant="subtitle2">No records found.</Typography></div>} 
                                                </div>
                                            </Grid>
                                    </Grid>
                            </div> } 
                                
                            {this.state.tabName === 'Employee' && <div class="tabcontent">
                
                                <Grid container style={{marginTop:'1rem', display:'flex',  maxHeight:'80px'}}>
                                                <Grid item xs={12} md={8}> 
                                                   {/* <FormControl fullWidth>
                                                        <InputLabel>Employees</InputLabel>
                                                        <Select
                                                        labelId=""
                                                        id="selectedemps"
                                                        multiple
                                                        value={this.state.selectedemps}
                                                        onChange={(e)=>{
                                                            this.handlechangeSelect(e);
                                                        }}
                                                        input={<Input id="select-multiple-chip" />}
                                                        renderValue={(selected) => (
                                                            <div>
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={this.getEmpName(value)} />
                                                            ))}
                                                            </div>
                                                        )}
                                                        MenuProps={MenuProps}
                                                        >
                                                        {this.state.employeelist.map(emp => (
                                                            <MenuItem value={emp.id}>
                                                                <Checkbox checked={this.checkEmp(emp.id)} />  
                                                                {emp.firstName+" "+emp.lastName} 
                                                            </MenuItem>
                                                        ))}
                                                        </Select>
                                                    </FormControl> */}
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}> 
                                                        <IconButton onClick={()=>{
                                                            this.setState({showDatePopup: true})
                                                        }}><CalendarMonthIcon/></IconButton>
                                                    </div>
                                                </Grid> 
                                        </Grid>

                                    <Grid container  style={{marginTop:'1rem'}}>
                                            <Grid item xs={12} md={12}>
                                                <div style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 5rem'}}> 
                                                    {this.state.employees.length > 0 && this.renderEmployeeReport()}
                                                    {this.state.employees.length === 0 && !this.state.isLoading && <div><Typography variant="subtitle2">No records found.</Typography></div>}
                                                </div>
                                            </Grid>
                                    </Grid>

                                </div> }
                            <Dialog
                                className="custommodal"
                                    open={this.state.showDatePopup}
                                    onClose={()=>{
                                        this.setState({showDatePopup: false, from_date: new Date(), to_date:new Date(), reporttype:'daily'})
                                    }}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    style={{borderRadius:'10px'}}
                                >
                                    <DialogTitle title="Select Date" id="alert-dialog-title">
                                    {/* <ModalHeader  onClose={()=>{
                                        this.setState({showDatePopup: false})
                                    }} /> */}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                    
                                            <Grid container>
                                                
                                                <Grid item xs={8} style={{padding:'20px'}}>
                                                    <form autoComplete="off" noValidate> 
                                                        <Stack direction={'column'}> 
                                                            <div  style={{margin:'10px 0'}}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
                                                                <DesktopDatePicker
                                                                    label="From"
                                                                    inputFormat="dd/MM/yyyy"
                                                                    maxDate={new Date()}
                                                                    style={{marginRight:'10px'}}
                                                                    value={this.state.from_date}
                                                                    onChange={this.handlechangeFromDate}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                />
                                                            </LocalizationProvider>
                                                            </div>
                                                            <div  style={{margin:'10px 0'}}>
                                                                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth 
                                                                        style={{marginLeft:'10px'}}>
                                                                    <DesktopDatePicker
                                                                        label="To"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        minDate={this.state.from_date}
                                                                        maxDate={new Date()}
                                                                        value={this.state.to_date} 
                                                                        onChange={this.handlechangeToDate}
                                                                        style={{marginLeft:'10px'}}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                    />
                                                                </LocalizationProvider>    
                                                            </div>
                                                        </Stack>
                                                    </form>  
                                                </Grid>
                                                <Grid item xs={4} style={{padding:'20px'}}> 
                                                    <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2}>
                                                        <FormControl component="fieldset">
                                                            <FormLabel component="legend">Report Type</FormLabel>
                                                            <RadioGroup  column aria-label="tax" name="row-radio-buttons-group">
                                                                <FormControlLabel   style={{margin:'10px 0'}} value={this.state.reportPeriod} control={<Radio checked={this.state.reportPeriod === 'daily'} value="daily" onChange={(e)=>{ 
                                                                    this.handleType(e)
                                                                }}/>} label="Daily" />
                                                                <FormControlLabel   style={{margin:'10px 0'}} value={this.state.reportPeriod} control={<Radio checked={this.state.reportPeriod === 'monthly'} value="monthly" onChange={(e)=>{ 
                                                                this.handleType(e) }}/>} label="Monthly" />
                                                                <FormControlLabel   style={{margin:'10px 0'}} value={this.state.reportPeriod} control={<Radio checked={this.state.reportPeriod === 'annually'} value="annually" onChange={(e)=>{ 
                                                                this.handleType(e) }}/>} label="Annually" />
                                                                    
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Stack>
                                                </Grid> 
                                            </Grid>
                                    
                                    </DialogContentText>
                                        </DialogContent>
                                    <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}>
                                        <Button variant="contained" onClick={()=>{this.setState({reportby:'changed'});this.getReports()}}> Get Report </Button>
                                    </DialogActions>
                        </Dialog> 
                        </Card> 
                }

                {!this.state.isAuthenticated && <Card style={{  position:'absolute',top:100,background:'transparent', left:0, right:0, bottom:0, zIndex:'999'}}>
                    <h3 style={{textAlign:'center'}}>Enter the passcode to access the reports</h3>
                    <NumberPad codeLength='4' textLabel='Enter code' handleChangeCode={this.handleChangeCode} onSubmit={this.getEmpDetail}  clearPasscode={clearPasscode => { this.clearPasscode = clearPasscode;
                    }}/>
                    <Dialog
                    open={this.state.showFormError}
                    onClose={()=>{
                        this.setState({showFormError:false, formError: ''})
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.formError}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>{
                             this.setState({showFormError:false, formError: ''})
                        }}>OK </Button> 
                    </DialogActions>
                </Dialog>

                </Card> }
            </Page>
        )
    }
}
 
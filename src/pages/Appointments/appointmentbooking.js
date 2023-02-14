import React from "react";
import TimePicker from 'rc-time-picker'; 
import 'rc-time-picker/assets/index.css';
import {TextField, Paper, Button, IconButton, Box, Grid, Stack, MenuItem} from '@mui/material';
import { TimerOutlined, Add, Remove } from '@mui/icons-material'
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment'; 
import './appt.css'
import LoaderComponent from '../../components/Loader';
import HTTPManager from "../../utils/httpRequestManager";
import {SearchableSelect} from "@dccs/react-searchable-select-mui";
import FormManager from "../../components/formComponents/FormManager";
import DialogComponent from '../../components/Dialog';
import schema from './schema.json';

const format = 'hh:mm A';
const format24 = 'HH:mm';
 
const now = moment().hour(0).minute(0);
const today = moment()
export default class AppointmentBookingComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props)
        this.state = {
            appointmentDate : new Date(),
            schema:{},
            appointmentId: '',
            appointmentTime: now,
            showDeleteAppointment:false,
            totalDuration: 0,
            services:[],
            isLoading: true,
            technicians:[],
            customers:[],
            addCustomer:false,
            appointments:[
                {
                    customer:null,
                    services:[
                        {
                            service:null,
                            technician:null,
                            duration:30, 
                        }
                    ]
                }
            ],
            showError: false,
            errorMsg: true,
            showNewappointment: false
        }

        this.onChange = this.onChange.bind(this)
        this.getServices = this.getServices.bind(this)
        this.getTechnicians = this.getTechnicians.bind(this)
        this.addService = this.addService.bind(this)
        this.removeService = this.removeService.bind(this)
        this.getCustomers = this.getCustomers.bind(this)
        this.openAddCustomer = this.openAddCustomer.bind(this)
        this.saveAppointment = this.saveAppointment.bind(this)
        this.reset = this.reset.bind(this)
        this.deleteAppointment = this.deleteAppointment.bind(this)

        this.checkAppointment = this.checkAppointment.bind(this)
        
    }

    checkAppointment(i, continueOpt){
        if(i< this.state.appointments.length){
            var appt = this.state.appointments[i]

            if(i === 0 && (appt.customer === null || appt.customer === undefined || appt.customer === '')){
                continueOpt = false;  
            }
            appt.services.forEach((ser, j)=>{
                if(ser.service === null || ser.technician === null){
                    continueOpt = false;
                } 
                if(j === appt.services.length-1){
                    this.checkAppointment(i+1, continueOpt)
                }
            })
        }
        else{
            if(continueOpt){ 
                var selecteddatetime = (moment(new Date(this.state.appointmentDate)).format("YYYY-MM-DD")+" "+this.state.appointmentTime);
                var input = {
                    appointmentdate: moment(this.state.appointmentDate).format("YYYY-MM-DD"),
                    appointmenttime: moment(selecteddatetime).format("HH:mm"),
                    appointments: this.state.appointments,
                    appointmentId: this.state.appointmentId
                }
                // console.log(input);
                this.httpManager.postRequest('/merchant/appointment/save', {data:input}).then(res=>{
                    this.setState({showNewappointment:true})
                })
            }
            else{
                this.setState({showError:true, errorMsg:'Please fill all the fields.'})
            } 
        }
    }

    deleteAppointment(){
        console.log(this.state.appointmentId);
        this.httpManager.postRequest("/merchant/appointment/delete",{id: this.state.appointmentId}).then(res=>{
            this.props.closeAppointment();
        })
    }

    saveAppointment(){

        var selecteddatetime = (moment(new Date(this.state.appointmentDate)).format("YYYY-MM-DD")+" "+this.state.appointmentTime);
        var isafter = moment(selecteddatetime).isAfter(moment.now());
    //    console.log(value.format(format24))
        if(isafter){ 
            
            this.checkAppointment(0, true)
        }
        else{
            this.setState({showError:true, errorMsg:'Please select time greater than the current time.'})
        }
    }

    reset(){
        this.setState({appointments:[
            {
                customer:null,
                services:[
                    {
                        service:null,
                        technician:null,
                        duration:30, 
                    }
                ]
            }
        ]})
    }

    getServices(){
        this.setState({isLoading: true})
        this.httpManager.postRequest(`merchant/product/getActive`,{data:"GET PRODUCT"}).then(response=>{ 
            // console.log(response.data)
            // this.setState({services: []},()=>{
            //     var data = []
            //     response.data.forEach((d, i)=>{
            //         data.push({
            //             id:d.mProductId,
            //             value: d.mProductName
            //         })
            //         if(i === response.data.length-1){ 
                            this.setState({services: response.data}, ()=>{
                                this.getTechnicians()
                            })
            //         }
            //     })
            // });
        })
    }
    getCustomers(){
        this.httpManager.postRequest(`merchant/customers/getCustomer`,{data:"EMP LIST"}).then(response=>{
            // console.log(response)
            this.setState({customers: response.data, isLoading: false}); 
        }) 
    }

    getTechnicians(){
        this.httpManager.postRequest(`merchant/employee/getAll`,{data:"EMP LIST"}).then(response=>{
            // console.log(response)
            this.setState({technicians: response.data},()=>{
                this.getCustomers()
            }); 
        }) 
    }

    componentDidMount(){
        this.setState({schema: schema},()=>{
            if(this.props.appointmentdetail !== undefined){
                console.log("DATA DETAIL")
                console.log(this.props.appointmentdetail)
                const appointmenttime = moment().hour(this.props.appointmentdetail.appointmentTime.split(":")[0]).minute(this.props.appointmentdetail.appointmentTime.split(":")[1])
                console.log(appointmenttime)
                this.setState({appointmentId: this.props.appointmentdetail.appointmentId, appointmentDate : this.props.appointmentdetail.appointmentDate, 
                appointmentTime: appointmenttime,
                appointments: this.props.appointmentdetail.appointments})
            }
            else{
                this.setState({appointmentId: ''})
            }
            this.getServices()
        });
    }

    openAddCustomer(){
        this.setState({schema: schema,selectedcustomer: {}},()=>{
            var schemaobj = Object.assign({}, schema);

            var properties = Object.assign([], this.state.schema.properties);
            var props=[];
            properties.forEach((field,i)=>{
                delete field["value"];
                if(field.name === 'mCustomerLoyaltyPoints'){ 
                    field.disabled = false;
                }
                else if(field.name === 'mCustomerDOB'){
                    field.disabled = false;
                }
                props.push(field);
                if(i === properties.length-1){
                    schemaobj.properties = props;
                }
            });
            this.setState({schema:schemaobj}, ()=>{
                this.setState({addCustomer: true}) 
            })
        })
    }

    onChange(value) {
    //     console.log("TIME VALUE")
    //     var selecteddatetime = (moment(new Date(this.state.appointmentDate)).format("YYYY-MM-DD")+" "+value.format(format24));
    //     var isafter = moment(selecteddatetime).isAfter(moment.now());
    // //    console.log(value.format(format24))
    //     if(isafter){
            this.setState({appointmentTime: value.format(format24)})
        // }
        // else{
        //     this.setState({showError:true, errorMsg:'Please select time greater than the current time.'})
        // }
    }

    renderMenuItems(appt, j){
        var searchText = appt.services[j].searchText;
        console.log("SEARCJ", searchText)
        var filteredServices = this.state.services.filter(r=>r.mProductName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
        if(searchText === ''){
            filteredServices = Object.assign([], this.state.services)
        }
        console.log(filteredServices)
        return filteredServices.map(r=> <MenuItem value={r.mProductId}>{r.mProductName}</MenuItem> )
        
    }

    addService(i){
        var appts = Object.assign([], this.state.appointments);
        var appt = appts[i]
        appt.services.push({
            service:null,
            technician:null,
            duration:30, 
        })
        this.setState({appointments: appts})
    }
    removeService(i, j){
        var appts = Object.assign([], this.state.appointments);
        var appt = appts[i]
        appt.services.splice(j,1);
        appts[i] = appt; 
        console.log(appts)
        this.setState({appointments: appts})
    }

    render(){
        return <>
        {this.state.isLoading && <LoaderComponent />}
        {!this.state.isLoading &&<div style={{display:'flex',  height:'100%', flexDirection:'column'}}> 
            
            <div className="appt_topbar">
                <div style={{display:'flex'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <Paper  style={{marginRight:'5px'}}>Date</Paper>
                            <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
                                <DesktopDatePicker 
                                    inputFormat="MM/dd/yyyy"
                                    minDate={new Date()} 
                                    style={{marginRight:'10px'}}
                                    disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false}
                                    value={this.state.appointmentDate}
                                    onChange={(e)=>{
                                        this.setState({appointmentDate: e})
                                    }}
                                    renderInput={(params) => <TextField className="appt_textfield" variant="standard" {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div style={{margin:'0 10px', display:'flex', alignItems:'center'}}>
                            <Paper style={{marginRight:'5px'}}>Time</Paper>
                            <TimePicker
                                showSecond={false}
                                disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false}
                                defaultValue={this.props.appointmentdetail !== undefined ?  moment().hour(Number(this.props.appointmentdetail.appointmentTime.split(":")[0])).minute(Number(this.props.appointmentdetail.appointmentTime.split(":")[1])) : moment().hour(today.format("HH")).minute(today.format("mm"))} 
                                className="appt_timepicker"
                                onChange={this.onChange}
                                format={format}
                                use12Hours
                                inputReadOnly
                                inputIcon={<TimerOutlined/>}
                            />  
                        </div>
                </div>


                <div style={{display:'flex'}}>
                    <div style={{display:'flex'}}> 
                        {/* <span style={{marginRight:'8px'}}>Duration: </span>
                        <Paper>{this.state.totalDuration} Mins</Paper> */}
                         <Button variant="contained" disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false} style={{marginRight:'1rem'}} onClick={()=>{ 
                            this.openAddCustomer();
                        }}>Add Customer</Button>
                        <Button variant="contained" disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false} onClick={()=>{
                            var appts = Object.assign([], this.state.appointments)
                            appts.push({
                                customer:null,
                                services:[
                                    {
                                        service:null,
                                        technician:null,
                                        duration:30, 
                                    }
                                ]
                            })
                            this.setState({appointments: appts})
                        }}>Add Guest</Button>
                    </div>
                </div>

            </div>
            <div className="appt_content"> 

                <table className="servicetbl" style={{width:'100%'}}>
                    <tr>
                        <th style={{width:'50px'}}>No</th>
                        <th style={{width:'300px'}}>Customer Mobile / Name</th>
                        <th style={{width:'calc(100% - 350px)', padding:'0'}}>
                            <div style={{display:'flex', flexDirection:'column'}}> 
                                <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                                        <div style={{width:'30%',borderRight: '1px solid #d0d0d0',padding:'5px',}}>Service</div>
                                        <div style={{width:'30%',borderRight: '1px solid #d0d0d0',padding:'5px',}}>Technician</div>
                                        <div style={{width:'20%',padding:'5px',}}>Duration(mins)</div>
                                        <div style={{width:'20%',padding:'5px',}}></div>
                                </div>
                            </div>
                        </th> 
                    </tr>
                    {this.state.appointments.map((appt, i)=>{
                        return <tr>
                                <td>{i+1}</td>
                                <td>
                                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        <div style={{width:'80%'}}>
                                            {appt.customer !== null ? appt.customer.mCustomerName : ''} 
                                            <SearchableSelect 
                                            removeSelectionText=""
                                            placeholder="Select Customer"
                                            value={appt.customer}
                                            onChange={(e)=>{
                                                var appts = Object.assign([], this.state.appointments); 
                                                appt.customer = e.target.value
                                                appts[i] = appt;  
                                                this.setState({appointments: appts})
                                            }}
                                            disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false}
                                            options={this.state.customers} 
                                            keyPropFn={(option) => option.mCustomerId}
                                            valuePropFn={(option) => option.mCustomerName+"("+option.mCustomerMobile+")"}
                                            /> 
                                        </div>
                                        <div style={{width:'20%', display:'flex', alignItems:'flex-end'}}>
                                            {i > 0 && <IconButton  style={{background:'#134163', color:'#fff', padding:'2px'}}  onClick={()=>{
                                                var appts = Object.assign([], this.state.appointments)
                                                appts.splice(i, 1);
                                                this.setState({appointments: appts})
                                            }}>
                                                <Remove />
                                            </IconButton>}
                                        </div>
                                    </div> 
                                </td>
                                <td style={{padding:'0'}}>
                                    <div style={{display:'flex', flexDirection:'column'}}> 
                                        {appt.services.map((ser,j)=>{
                                            return <div style={{display:'flex', flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                    <div style={{width:'30%',borderRight: '1px solid #d0d0d0',padding:'5px',}}>
                                                   
                                                    <SearchableSelect 
                                                        removeSelectionText=""
                                                        value={ser.service}
                                                        defaultValue={ser.service}
                                                        disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false}
                                                        onChange={(e)=>{
                                                            var appts = Object.assign([], this.state.appointments);
                                                            var obj = appt.services[j];
                                                            obj["service"] = e.target.value;
                                                            appt.services[j] = obj
                                                            appts[i] = appt; 
                                                            console.log(appts)
                                                            this.setState({appointments: appts})
                                                        }}
                                                        options={this.state.services} 
                                                        keyPropFn={(option) => option.mProductId}
                                                        valuePropFn={(option) => option.mProductName}
                                                        />
                                                    </div>
                                                    <div style={{width:'30%',borderRight: '1px solid #d0d0d0',padding:'5px',}}>
                                                    <SearchableSelect 
                                                        removeSelectionText=""
                                                        value={ser.technician}
                                                        disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false}
                                                        onChange={(e)=>{
                                                            var appts = Object.assign([], this.state.appointments);
                                                            var obj = appt.services[j];
                                                            obj["technician"] = e.target.value;
                                                            appt.services[j] = obj
                                                            appts[i] = appt; 
                                                            console.log(appts)
                                                            this.setState({appointments: appts})
                                                        }}
                                                        options={this.state.technicians} 
                                                        keyPropFn={(option) => option.mEmployeeId}
                                                        valuePropFn={(option) => option.mEmployeeFirstName+" "+ option.mEmployeeLastName}
                                                        />
                                                    </div>
                                                    <div style={{width:'20%',padding:'5px', display:'flex', alignItems:'center'}}>
                                                        <TextField placeholder="Duration" disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false} value={ser.duration} type="number" variant="standard" onChange={(e)=>{
                                                            var appts = Object.assign([], this.state.appointments);
                                                            var obj = appt.services[j];
                                                            if( e.target.value.length < 4)
                                                                obj["duration"] = e.target.value;
                                                            appt.services[j] = obj
                                                            appts[i] = appt;  
                                                            this.setState({appointments: appts})
                                                        }} onKeyDown={(e)=>{
                                                            const pattern = /^[0-9]$/;  
                                                            if(!pattern.test(e.key) && e.keyCode !== 8  && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                                                                e.preventDefault();
                                                            }
                                                        }} />
                                                    </div>
                                                    <div style={{width:'20%',padding:'5px',}}>
                                                            <IconButton   style={{background:'#134163', color:'#fff', padding:'2px'}} onClick={()=>{
                                                                this.addService(i)
                                                            }}><Add /></IconButton>
                                                            {j>0 && <IconButton variant="contained"  style={{marginLeft:'5px',background:'#134163', color:'#fff', padding:'2px'}} onClick={()=>{
                                                                this.removeService(i, j)
                                                            }}><Remove/></IconButton>}
                                                    </div>
                                                </div>
                                            }
                                        )}
                                    </div>
                                </td> 
                            </tr> 
                    }
                    )}
                </table>
            </div>
            <div className="appt_footer">
                <div style={{width:'300px'}}>
                    {/* <TextField placeholder="Remarks" fullWidth maxRows={4} multiline /> */}
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Button variant="contained" disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false} onClick={()=>{
                        this.saveAppointment()
                    }}>Book Appointment</Button>
                    <Button variant="contained" color="secondary" disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false} onClick={()=>{
                        this.reset()
                    }}>Reset</Button>
    {this.state.appointmentId !== '' && 
                    <Button variant="contained" disabled={ this.props.appointmentdetail !== undefined && this.props.appointmentdetail.editable === false} color="error" onClick={()=>{
                        // this.deleteAppointment()
                        this.setState({showDeleteAppointment: true})
                    }}>Delete Appointment</Button>}
                </div>
            </div>
          
            </div>
        }


{this.state.addCustomer && <DialogComponent open={this.state.addCustomer} onClose={()=>{
    this.setState({addCustomer:false})
}} >

<Box sx={{ width: '100%' }} className="appointmentcustomer"> 
    <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
            <Grid item xs={12}> 
            <Stack spacing={3}> 
                <FormManager formProps={this.state.schema}  reloadData={(msg,data)=>{
                    this.setState({addCustomer: false})
                    this.getCustomers();
                }} closeForm={()=>this.handleCloseform()}/>
            </Stack>
        </Grid>
    </Grid>
</Box>
</DialogComponent>}

{this.state.showError && <DialogComponent className="giftcardpopup" open={this.state.showError} onClose={()=>{
    this.setState({showError: false},()=>{
        this.setState({errorMsg:''})
    })
}} title=""><div>{this.state.errorMsg}</div></DialogComponent>}


{this.state.showNewappointment && <DialogComponent  className='noprintpopup' open={this.state.showNewappointment} onClose={()=>{
    this.setState({showError: false},()=>{
        this.setState({errorMsg:''})
    })
}} title="Appointment Booked Successfully"><div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
  
   <div style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
    {/* <Button variant="contained" onClick={()=>{
        this.reset();
        this.setState({showNewappointment: false})
    }}>Yes</Button> */}
    <Button variant="outlined" onClick={()=>{
        this.reset();
        this.props.closeAppointment()
    }}>OK</Button></div>
    </div></DialogComponent>}



{this.state.showDeleteAppointment && <DialogComponent className="notespopup" open={this.state.showDeleteAppointment} onClose={()=>{
    this.setState({showError: false},()=>{
        this.setState({errorMsg:''})
    })
}} title="Confirmation"><div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
    Would you like to delete this appointment?
   <div style={{display:'flex', alignItems:'center', marginTop:'20px', flexDirection:'row'}}>
    <Button variant="contained" style={{marginRight:'1rem'}} onClick={()=>{
        this.deleteAppointment()
    }}>Yes</Button>
    <Button variant="outlined" onClick={()=>{
        this.setState({showDeleteAppointment: false})
    }}>No</Button></div>
    </div></DialogComponent>} 
        </>
    }
}
import React from "react";
import TimePicker from 'rc-time-picker'; 
import 'rc-time-picker/assets/index.css';
import {TextField, Paper, Button, IconButton, FormControl, InputLabel, Select, MenuItem, ListSubheader} from '@mui/material';
import { TimerOutlined, Add, Remove } from '@mui/icons-material'
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment'; 
import './appt.css'

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();

const format = 'hh:mm A';
const format24 = 'HH:mm';

const now = moment().hour(0).minute(0);

export default class AppointmentBookingComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            appointmentDate : new Date(),
            appointmentTime: now,
            totalDuration: 0,
            appointments:[
                {
                    customer:null,
                    services:[
                        {
                            service:null,
                            technician:null,
                            duration:30
                        }
                    ]
                }
            ]
        }

        this.onChange = this.onChange.bind(this)
    }

    onChange(value) {
        console.log("TIME VALUE")
        console.log(value && value.format(format24));
        this.setState({appointmentTime: value.fomat(format24)})
    }

    render(){
        return <div style={{display:'flex',  height:'100%', flexDirection:'column'}}> 
            
            <div className="appt_topbar">
                <div style={{display:'flex'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <Paper  style={{marginRight:'5px'}}>Date</Paper>
                            <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
                                <DesktopDatePicker 
                                    inputFormat="MM/dd/yyyy"
                                    maxDate={new Date()}
                                    style={{marginRight:'10px'}}
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
                                defaultValue={now}
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
                        <span style={{marginRight:'8px'}}>Duration: </span>
                        <Paper>{this.state.totalDuration} Mins</Paper>
                    </div>
                </div>

            </div>
            <div className="appt_content"> 

                <table className="servicetbl" style={{width:'100%'}}>
                    <tr>
                        <th style={{width:'50px'}}>No</th>
                        <th style={{width:'150px'}}>Customer Mobile</th>
                        <th style={{width:'150px'}}>Customer Name</th>
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

                                </td>
                                <td>

                                </td>
                                <td style={{padding:'0'}}>
                                    <div style={{display:'flex', flexDirection:'column'}}> 
                                        {appt.services.map((ser,j)=>{
                                            return <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                                                    <div style={{width:'30%',borderRight: '1px solid #d0d0d0',padding:'5px',}}>
                                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                        <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
                                                        <Select defaultValue="" id="grouped-select" label="Grouping">
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        <ListSubheader>Category 1</ListSubheader>
                                                        <MenuItem value={1}>Option 1</MenuItem>
                                                        <MenuItem value={2}>Option 2</MenuItem>
                                                        <ListSubheader>Category 2</ListSubheader>
                                                        <MenuItem value={3}>Option 3</MenuItem>
                                                        <MenuItem value={4}>Option 4</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    </div>
                                                    <div style={{width:'30%',borderRight: '1px solid #d0d0d0',padding:'5px',}}>
                                                        
                                                    </div>
                                                    <div style={{width:'20%',padding:'5px', display:'flex', alignItems:'center'}}>
                                                        <TextField placeholder="Duration"/>
                                                    </div>
                                                    <div style={{width:'20%',padding:'5px',}}>
                                                            <IconButton   style={{background:'#134163', color:'#fff', padding:'2px'}} onClick={()=>{

                                                            }}><Add /></IconButton>
                                                            <IconButton variant="contained"  style={{marginLeft:'5px',background:'#134163', color:'#fff', padding:'2px'}} onClick={()=>{

                                                            }}><Remove/></IconButton>
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
                    <TextField placeholder="Remarks" fullWidth maxRows={4} multiline />
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Button variant="contained">Book</Button>
                    <Button variant="contained" colar="secondary">Reset</Button>
                </div>
            </div>
          
        </div>
    }
}
import React from "react";
import {Container, Grid, Button} from '@mui/material';
import Page from '../../components/Page';
import LoaderContent from '../../components/Loader';
import AppointmentBookingComponent from "./appointmentbooking";
import DialogComponent from '../../components/Dialog';
import AppointmentCalendar from "./calendar";

export default class AppointmentComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showBooking: false,
            appointmentdetail: undefined
        }
    }

    render(){
        return <Page title="Payout | Astro POS">
                {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
                <Container maxWidth="xl" style={{display:'flex', alignItems:'center',flexDirection:'column', justifyContent:'space-between' }}>
                    <Grid Container>
                        <Grid item xs={9}>
                            Appointments
                        </Grid>
                        <Grid item xs={3} style={{display:'flex', alignItems:'flex-end', justifyContent:'flex-end'}}>
                            <Button variant="contained" onClick={()=>{
                                this.setState({showBooking: true})
                            }}>+ Book Appointment</Button>
                        </Grid>
                    </Grid>
                
                    {!this.state.showBooking && <Grid Container>
                        <Grid item xs={12} style={{height:'calc(100% - 200px)'}}>
                            <AppointmentCalendar editAppointment={(data)=>{
                                this.setState({appointmentdetail :data }, ()=>{
                                    this.setState({showBooking: true})
                                })
                            }} />
                        </Grid>
                    </Grid>}

                   {this.state.showBooking && <DialogComponent open={this.state.showBooking} title="Book Appointment" className="appointmentpopup" onClose={()=>{
                    this.setState({showBooking: false, appointmentdetail: undefined})
                   }}>
                    <AppointmentBookingComponent appointmentdetail={this.state.appointmentdetail} closeAppointment={()=>{
                        this.setState({showBooking: false, appointmentdetail: undefined})
                    }}/>
                    </DialogComponent>} 
                </Container>
        </Page>
    }
}
import React from "react";
import {Container, Grid, Button} from '@mui/material';
import Page from '../../components/Page';
import LoaderContent from '../../components/Loader';
import AppointmentBookingComponent from "./appointmentbooking";
import DialogComponent from '../../components/Dialog';


export default class AppointmentComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showBooking: false
        }
    }

    render(){
        return <Page title="Payout | Astro POS">
                {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
                <Container maxWidth="xl" style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
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

                   {this.state.showBooking && <DialogComponent open={this.state.showBooking} title="Book Appointment" className="appointmentpopup" onClose={()=>{
                    this.setState({showBooking: false})
                   }}>
                    <AppointmentBookingComponent />
                    </DialogComponent>} 
                </Container>
        </Page>
    }
}
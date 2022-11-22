import React from 'react';
import { Grid, Typography} from '@material-ui/core/';   

const amtDetail ={
    margin:'5px'
}

const disDetail ={
    margin:'5px',
    color: 'red'
}
const taxDetail={
    margin:'5px',
    color: '#134163'
}

export default class TicketTotalComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {

        }
    }    

    render(){
        return <div style={{background: '', marginLeft: -20, borderRight:0,borderBottom:0}}>
        <Grid item xs={12} style={{display:'flex', background: ''}}>
            <Grid item xs={6} style={{ borderRight:0,paddingLeft: 20,paddingTop: 10, paddingBottom: 10}}>
                <Typography id="modal-modal-title" variant="subtitle2" align="left"> </Typography>
                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={amtDetail}>Retail : ${Number(this.props.data.price.retailPrice).toFixed(2)}</Typography>
                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={amtDetail}>Services : ${Number(this.props.data.price.servicePrice).toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Grid item xs={12} style={{display:'flex'}}>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:0, borderRight:0, borderTop: 0}}>
                        <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Subtotal </Typography></Grid>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0',  borderBottom:'0', borderRight:0, borderTop: 0}}>
                        <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="right">$ {Number(this.props.data.price.ticketSubTotal).toFixed(2)}  </Typography></Grid>
                </Grid>

                <Grid item xs={12} style={{display:'flex'}}>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}><Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Discount </Typography></Grid>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0 }}><Typography style={disDetail} id="modal-modal-title" variant="subtitle2" align="right"> - ${Number(this.props.data.price.ticketDiscount).toFixed(2)}  </Typography></Grid>
                </Grid>

                <Grid item xs={12} style={{display:'flex'}}>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}><Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Tax </Typography></Grid>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}><Typography style={taxDetail} id="modal-modal-title" variant="subtitle2" align="right"> + ${Number(this.props.data.price.taxAmount).toFixed(2)}  </Typography></Grid>
                </Grid>

                <Grid item xs={12} style={{display:'flex'}}>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}>
                        <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">
                        Tips </Typography></Grid>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}><Typography style={taxDetail} id="modal-modal-title" variant="subtitle2" align="right"> + ${Number(this.props.data.price.tipsAmount).toFixed(2)}  </Typography></Grid>
                </Grid> 
                <Grid item xs={12} style={{display:'flex'}}>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}>
                        <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Total </Typography></Grid>
                    <Grid item xs={6} style={{border:'2px solid #d0d0d0', borderBottom:'0', borderRight:0}}>
                        <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="right">${Number(this.props.data.price.grandTotal).toFixed(2)} </Typography></Grid>
                </Grid>
            </Grid>
        </Grid>
        </div>
    }
}
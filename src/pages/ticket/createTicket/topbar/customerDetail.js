import React from 'react';
import { Grid, Typography, Paper} from '@material-ui/core/'; 
import Moment from 'moment';
import CloseIcon from '@mui/icons-material/Close'; 

const cusDetail ={
  margin:'10px'
} 
export default function CustomerDetailModal(
    {
        open,
        onClose,
        handleClosePayment,
        customerDetail 
}) 

{
  return ( 
        <Paper style={{background:'#fff',boxShadow:'none', position:'relative', borderRadius: 10}}> 
          <Grid container spacing={2}>
            <Grid item xs={12} style={{display:'flex',marginTop: 20, marginLeft: 10, marginRight: 10, background: 'white'}}>
              <Grid item xs={5} style={{marginLeft: 10, color:'#134163' }}>
              <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold', marginTop: 0}} variant="subtitle2" noWrap >{customerDetail.mCustomerName}</Typography>
              </Grid>

              <Grid item xs={5}>
                  
              </Grid>
              <Grid item xs={2} style={{marginRight: 20}}>
                 
                  <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={onClose}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
              </Grid>      
            </Grid>

          </Grid> 
       

        <Grid container spacing={0}  direction="column" alignItems="center"  justifyContent="center" style={{background: 'white'}} >

        
        
          <Grid style={{display:"flex", background: 'white', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" noWrap align="left">Member ID : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap >{customerDetail.mCustomerMemberId}</Typography>
          </Grid>   

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" noWrap align="left">Phone : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap >{customerDetail.mCustomerMobile !== ''  && customerDetail.mCustomerMobile !== null ? customerDetail.mCustomerMobile : '--' }</Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" noWrap align="left">Email : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>{customerDetail.mCustomerEmail !== '' ? customerDetail.mCustomerEmail : '--' }</Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" align="left"noWrap >DOB : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>{customerDetail.mCustomerDOB !== '' && customerDetail.mCustomerDOB !== null ? Moment(customerDetail.mCustomerDOB).format('MM-DD-YYYY') : '--'} </Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" align="left" noWrap >First Visit : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>{customerDetail.created_at !== null ? Moment(customerDetail.created_at).format('MM-DD-YYYY') : '--'} </Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" align="left" noWrap>Last Visit : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>--</Typography>
          </Grid>


         
          
        </Grid> 

        
        <Grid container spacing={0}  direction="row" alignItems="center"  justifyContent="center" style={{marginTop: 20, marginBottom: 20}}>
        <Grid xs={4} >
          <Grid style={{display:'column', background: 'white'}} alignItems="center"  justifyContent="center">
                <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="center"> {customerDetail.mCustomerVisitCount !== '' ? customerDetail.mCustomerVisitCount : '--'}</Typography>
                <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold'}} variant="subtitle2"  color="textSecondary" align="center" noWrap >Visit Count</Typography>
              
          </Grid>
        </Grid> 
          <Grid xs={4} style={{borderLeft:'1px solid #d7d7d7'}}>
                <Grid style={{display:'column', background: 'white'}} alignItems="center"  justifyContent="center">
                    <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="center"> $ {customerDetail.mCustomerTotalSpent !== '' ? customerDetail.mCustomerTotalSpent : 0 }</Typography>
                    <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold'}} variant="subtitle2"  color="textSecondary" align="center" noWrap >Total Spent </Typography>
                    
                </Grid>
        </Grid> 

          <Grid xs={4} style={{borderLeft:'1px solid #d7d7d7'}}>
                <Grid style={{display:'column', background: 'white'}} >

                    <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="center"> { customerDetail.mCustomerLoyaltyPoints !== null && customerDetail.mCustomerLoyaltyPoints !== '' ? customerDetail.mCustomerLoyaltyPoints : '--'}</Typography>
                    <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold'}} variant="subtitle2"  color="textSecondary" align="center" noWrap >Loyality Points</Typography>
                    
                </Grid>

            </Grid>           
           

        </Grid> 

      </Paper> 
  );
}

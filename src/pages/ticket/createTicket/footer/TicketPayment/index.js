import React from 'react'; 
import TicketPayment from './payment';
import {  Dialog, DialogTitle, DialogContent} from '@mui/material'; 
export default function PaymentModal(
    {  
        handleClosePayment,
        ticketDetail,
        price

}) 

{
  return ( 

<Dialog
    open={true}
    onClose={()=>{
        handleClosePayment()
    }}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    style={{zIndex:'99999'}}
    className="paymentpopup"
>
    <DialogTitle id="alert-dialog-title"> 
    </DialogTitle>
    <DialogContent>
    <TicketPayment afterSubmit={handleClosePayment} ticketDetail={ticketDetail} price={price}></TicketPayment>
    </DialogContent> 
</Dialog>  




  );
}

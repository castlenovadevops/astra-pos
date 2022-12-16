import React from 'react'; 
import TicketPrint from './print';
import {  Dialog, DialogTitle, DialogContent} from '@mui/material'; 
export default function PaymentModal(
    {  
        handleClosePayment,
        ticketDetail,
        price,
        customer_detail,
        selectCustomerDetail
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
    <TicketPrint afterSubmit={()=>{
      handleClosePayment('reload')
    }} selectCustomerDetail={selectCustomerDetail} customerDetail={customer_detail} ticketDetail={ticketDetail} price={price}></TicketPrint>
    </DialogContent> 
</Dialog>  




  );
}

import React from 'react';
import { Grid,Button, Dialog, DialogActions, DialogContent, DialogTitle  } from '@material-ui/core/'; 
import Discounts from './discounts'; 

export default function DiscountTicketModal({
        handleCloseAddDiscounts,
        ticket_discount_selected,
        ticket_grandTotal,
        discount_list,
        afterSubmitDiscount
}) 
{
    return (<Dialog
        open={true}
        onClose={()=>{
            this.props.data.selectedMenu(1)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{zIndex:'99999'}}
        className="tipspopup"
    >
        <DialogTitle id="alert-dialog-title">
        Discounts
    </DialogTitle>
    <DialogContent>
    <Discounts  discount_selected={ticket_discount_selected} ticket_service_total={ticket_grandTotal} 
                discount_list={discount_list} afterSubmitDiscount={afterSubmitDiscount} ></Discounts>
    </DialogContent> 
</Dialog>   
    )
}
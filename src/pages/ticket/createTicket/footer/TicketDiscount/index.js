import React from 'react';
import { Grid,Button, Dialog, DialogActions, DialogContent, DialogTitle  } from '@material-ui/core/'; 
import Discounts from './discounts'; 

export default function DiscountTicketModal({ 
    data
}) 
{
    return (<Dialog
        open={true}
        onClose={()=>{
           data.closeDiscount()
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
    <Discounts  data={data}></Discounts>
    </DialogContent> 
</Dialog>   
    )
}
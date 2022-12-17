import React from 'react';  
import OpenTicketsComponent from './opentickets';
import { Grid,Button, Dialog, DialogActions, DialogContent, DialogTitle  } from '@mui/material'; 
export default function TransferService({
   data
   
}) 
{ 
   
    return (<Dialog
        open={true}
        onClose={data.closePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{zIndex:'99999'}}
        className="transferpopup"
    >
        <DialogTitle id="alert-dialog-title">
        Transfer Service
    </DialogTitle>
    <DialogContent>
        <OpenTicketsComponent data={data} />
    </DialogContent> 
</Dialog>   
    )   
}
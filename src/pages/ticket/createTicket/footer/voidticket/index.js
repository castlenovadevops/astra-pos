import { Button, Typography, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import React from 'react';     

export default function VoidModal(
    {
    
        handleCloseVoidAlert,
        updateVoidTicket,
        title,
        msg
    
     
}) 

{
  return (

    <Dialog
        open={true}
        onClose={handleCloseVoidAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{zIndex:'99999'}}
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>{msg}</Typography>
        </DialogContentText>
        </DialogContent>
        <DialogActions> 
            <Button onClick={updateVoidTicket}  variant="contained">Yes</Button>
            <Button onClick={handleCloseVoidAlert} variant="outlined">No</Button> 
        </DialogActions> 
    </Dialog> 
        
  );
}

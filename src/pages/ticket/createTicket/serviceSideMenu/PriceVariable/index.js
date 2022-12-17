import React from 'react'; 
import VariablePrice from './variablePrice'; 

import { Grid,Button, Dialog, DialogActions, DialogContent, DialogTitle  } from '@mui/material'; 
export default function VariablePriceModal({
   data
   
}) 
{ 
   
    return (<Dialog
        open={true}
        onClose={data.closePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{zIndex:'99999'}}
        className="tipspopup"
    >
        <DialogTitle id="alert-dialog-title">
        Variable Price
    </DialogTitle>
    <DialogContent>
    <VariablePrice data={data}></VariablePrice>
       
    </DialogContent> 
</Dialog>   
    )   
}
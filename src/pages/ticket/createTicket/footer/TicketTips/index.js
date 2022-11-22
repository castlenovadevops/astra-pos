import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/'; 
import Tips from './tips'; 
export default function TicketTipsModal({
    handleCloseAddTips,
    employee_list,
    afterSubmitTips,
    selectedServices,
    total_tips,
    tips_percent,
    tips_type
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
        Tips
    </DialogTitle>
    <DialogContent>
    <Tips afterSubmitTips={afterSubmitTips} selectedServices={selectedServices} 
            total_tips={total_tips} tips_percent={tips_percent} tips_type={tips_type}></Tips>
    </DialogContent> 
</Dialog>  
)
}
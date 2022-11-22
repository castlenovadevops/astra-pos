import React from 'react';
import { Grid } from '@material-ui/core/';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import Tips from './tips'; 
export default function TicketTipsModal({
    handleCloseAddTips,
    employee_list,
    afterSubmitTips,
    service_selected,
    total_tips,
    tips_percent,
    tips_type
}) 
{
return (
    <div>
    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
        </div>
        <div style={{background:'#fff',width:'50%', margin:'10% auto 0', position:'relative', borderRadius: 10}}>
        <Grid container spacing={2}>
            <ModalTitleBar  title="Tips" onClose={handleCloseAddTips}/>
            <Tips employee_list={employee_list} afterSubmitTips={afterSubmitTips} service_selected={service_selected} 
            total_tips={total_tips} tips_percent={tips_percent} tips_type={tips_type}></Tips>
        </Grid>

        </div>
    </div>
    </div>
)
}
import React from 'react';
import { Grid } from '@material-ui/core/';
import ModalTitleBar from '../../../../components/Modal/Titlebar';
import Discounts from './discounts'; 

export default function DiscountTicketModal({
        handleCloseAddDiscounts,
        ticket_discount_selected,
        ticket_grandTotal,
        discount_list,
        afterSubmitDiscount
}) 
{
    return (
        <div>
        <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute',zIndex:1}}>
            <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
            </div>
            <div style={{background:'#fff',  width:'50%', margin:'10% auto 0', position:'relative', borderRadius: 10}}>
            <Grid container spacing={2}>
                <ModalTitleBar  title="Discounts" onClose={handleCloseAddDiscounts}/>
                <Discounts  discount_selected={ticket_discount_selected} ticket_service_total={ticket_grandTotal} 
                discount_list={discount_list} afterSubmitDiscount={afterSubmitDiscount} ></Discounts>
            </Grid>

            </div>
        </div>
        </div>
    )
}
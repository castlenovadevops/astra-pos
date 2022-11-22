import React from 'react';
import { Grid,Typography} from '@material-ui/core/';   
import HTTPManager from '../../../../utils/httpRequestManager';
export default class DiscountsListComponent extends React.Component{
    httpManager = new HTTPManager()
    constructor(props){
        super(props);
        this.state={
            discountsList:[]
        }
    }

    componentDidMount(){
       this.httpManager.postRequest("merchant/discounts/get",{data:"TICKET"}).then(res=>{
        this.setState({discountsList: res.data})
       })
    }


    isDiscountCheck(id){ 
        var servicediscounts = this.props.data.selectedServices[this.props.data.selectedRow].ticketservicediscounts.map(t=>t.mDiscountId.toString());
        if(servicediscounts.indexOf(id.toString()) !== -1 ){
            return true
        }

        return false;
    }


    render(){
        return <Grid item xs={12} style={{display:'flex', flexWrap:'wrap'}}> 
        {this.state.discountsList.map((dis) => (   
                <Grid item xs={6} onClick={(e) => this.props.data.selectDiscount(dis)}  
                style={{border:'2px solid #f0f0f0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', background: this.isDiscountCheck(dis.mDiscountId) ? '#bee1f7':'transparent',
                alignItems:'center', justifyContent:'center',cursor:'pointer'}}>

                        <Typography id="modal-modal-title" variant="subtitle2"  style={{maxHeight:'60px', overflow:'hidden',  
                        textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                        align="center"> 
                            {dis.mDiscountName}<br/>
                            {dis.mDiscountType === 'percentage' ? dis.mDiscountValue+"%" : "$"+dis.mDiscountValue}
                        </Typography>
                 </Grid>  
                 
        ))} 
    </Grid>  
    }
}
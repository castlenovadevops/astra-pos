import React from 'react';
import { Grid, Typography, Button} from '@material-ui/core/';
import Box from '@material-ui/core/Box'; 
import HTTPManager from '../../../../../utils/httpRequestManager';
const service = {
    // border:'2px solid #f0f0f0',
    // padding: 10,
    // cursor:'pointer',
    // height:'100%',
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center'
}

class Discounts extends React.Component {
    httpManager = new HTTPManager()
    constructor(props) {
        super(props);
        this.state={
            discount_list: [], 
            isApply: false, 
            selectedDiscounts:[],
            totalDiscountAmount:0
        }
    }
    componentDidMount(){  
        this.httpManager.postRequest("merchant/discounts/get",{data:"TICKET"}).then(res=>{
         this.setState({discount_list: res.data})
        })
        if(this.props.data.ticketdiscounts.length > 0){
            this.setState({selectedDiscounts: this.props.data.ticketdiscounts, totalDiscountAmount: this.props.data.price.ticketDiscount})
        }
     } 

     addOrRemoveDiscount(discount){
        var selecteddiscounts = Object.assign([], this.state.selectedDiscounts);
        var selectedids = selecteddiscounts.map(d=>d.mDiscountId);
        var discounttotal = 0;
        let idx = selectedids.indexOf(discount.mDiscountId);
        if(idx === -1){
            var discountobj = Object.assign({}, discount);
            discountobj.mDiscountAmount = 0
            if(discount.mDiscountType === 'Percentage'){
                discountobj.mDiscountAmount  = (Number(discount.mDiscountValue)/100) * Number(this.props.data.price.ticketSubTotal)
            }
            else{
                discountobj.mDiscountAmount  = discount.mDiscountValue
            }
            selecteddiscounts.push(discountobj)
        }
        else{
            selecteddiscounts.splice(idx,1)
        }
        selecteddiscounts.forEach(d=>{
            discounttotal= Number(discounttotal) + Number(d.mDiscountAmount) 
        })
        this.setState({selectedDiscounts:selecteddiscounts, totalDiscountAmount: discounttotal}, ()=>{
            this.props.data.updateTicketDiscount(this.state.selectedDiscounts, this.state.totalDiscountAmount)
        }) 
     }

     checkDiscount(discount){ 
        var selecteddiscounts = Object.assign([], this.state.selectedDiscounts);
        var selectedids = selecteddiscounts.map(d=>d.mDiscountId); 
        let idx = selectedids.indexOf(discount.mDiscountId);
        return idx === -1 ? false : true
     }
    render() {
        return (
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap',height:'450px', overflow:'auto', padding: '0 20px'}}> 
                    <Grid item xs={12}>
                        <div style={{height:'100%', width:'100%', display:'flex', flexWrap:'wrap', alignContent:'baseline'}}>
                        {this.state.discount_list.map((dis, index) => (
                            <Grid item xs={3} style={{height:'100px',paddingRight: 2,paddingLeft: 2, paddingTop:2,paddingBottom:2
                            }} >
                                <div style={{'background':(this.checkDiscount(dis)  ? '#bee1f7':'#F2F2F2'),  border:(this.checkDiscount(dis)  ? '2px solid #bee1f7' :'2px solid #F2F2F2'), textTransform:'capitalize',
                            borderRadius: 10,'color':(this.checkDiscount(dis) ? '#000':'#000'), display:'flex', alignItems:'center', justifyContent:'center',
                            marginLeft:(index>0)?10:0, cursor: 'pointer', height:70 }} onClick={() => {
                                this.addOrRemoveDiscount(dis)
                            }}>
                                 
                                         <Box
                                                          fontSize="subtitle2.fontSize"
                                                          component="div" 
                                                          overflow="hidden"            
                                                          whiteSpace="post-line"
                                                          textOverflow="ellipsis" 
                                                          style={{background:"", maxHeight:'75%', textAlign: 'center', width: '100%',marginLeft:2,marginRight:2 }}  
                                                        >
                                                          {dis.mDiscountName}<br/>
                                                          {dis.mDiscountType === 'Percentage' ? dis.mDiscountValue+"%" : "$"+dis.mDiscountValue}
                                                        </Box>
                                        </div>
                            </Grid>
                        ))} 
                        </div>
                    </Grid>  
                </Grid>
               
        )
    }
}
export default Discounts;
import React from 'react';
import { Grid, Typography, Button} from '@material-ui/core/';
import Box from '@material-ui/core/Box'; 
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
    constructor(props) {
        super(props);
        this.state={
            discount_list: [],
            selected_discount:'',
            selected_disDetails:{},
            isApply: false,
            ticket_grandTotal: 0,
            ticket_with_dis: 0,
            discount_value: 0,
            selected_discount_id:0,
        }
    }
    componentDidMount(){ 
        if(this.props.discount_list !== undefined){
            this.setState({discount_list: this.props.discount_list});
        }
        if(this.props.ticket_service_total !== undefined){
            this.setState({ticket_grandTotal: this.props.ticket_service_total});
        }
        console.log("sfdsfds",this.props.discount_selected, this.props.ticket_service_total);
        if(this.props.discount_selected.discount_id !== undefined && this.props.discount_selected.discount_id !== null){
            var grandTotal = Number(this.props.ticket_service_total) + Number(this.props.discount_selected.discount_totalamt);
            console.log(grandTotal,this.props.ticket_service_total ,this.props.discount_selected.discount_totalamt );
            var per_dis = 0;
            var ticket_with_dis = 0
            if(this.props.discount_selected.discount_type === 'percentage'){
                per_dis = (this.props.discount_selected.discount_value/100)* grandTotal;
            }else{
                per_dis = this.props.discount_selected.discount_value;
            }
            ticket_with_dis = Number(this.props.ticket_service_total);
            this.setState({selected_discount: this.props.discount_selected.discount_id,selected_disDetails:this.props.discount_selected,isApply: true, ticket_grandTotal: grandTotal,discount_value: per_dis,ticket_with_dis : ticket_with_dis}); 
        }
    }

    

    getDiscount(id){
        this.resetDiscount();
        if(this.state.selected_discount === id){ 
            var per_dis = this.state.discount_value; 
            var ticket_with_dis = Number(this.props.ticket_service_total) + per_dis; 

            this.setState({ selected_discount:'',
            selected_disDetails:{},
            isApply: false,
            ticket_grandTotal: ticket_with_dis,
            ticket_with_dis: ticket_with_dis,
            discount_value: 0,
            selected_discount_id:0}, function(){
                this.saveDiscount()
            })
        }
        else{
            if(this.state.selected_discount !== undefined){
                var per_dis = Number(this.state.discount_value); 
                var ticket_with_dis = Number(this.props.ticket_service_total) + per_dis; 
    
                this.setState({ selected_discount:'',
                selected_disDetails:{},
                isApply: false,
                ticket_grandTotal: ticket_with_dis,
                ticket_with_dis: ticket_with_dis,
                discount_value: 0,
                selected_discount_id:0}, function(){
                    let selected_discount_details = this.state.discount_list.filter(item => item.id === id);
                    this.setState({selected_discount: id, selected_disDetails: selected_discount_details[0], isApply: true});
            
                    var per_dis = 0;
                    var ticket_with_dis = 0;
                    //Discount Percentage Amt Calculation
                    if(selected_discount_details[0].discount_type === 'percentage'){
                        per_dis = (selected_discount_details[0].discount_value/100)*this.state.ticket_grandTotal;
                    }else{
                        per_dis = selected_discount_details[0].discount_value;
                    }
                    console.log(this.state.ticket_grandTotal, per_dis);
                    ticket_with_dis = this.state.ticket_grandTotal - per_dis;
                    this.setState({ticket_with_dis : ticket_with_dis,discount_value: per_dis }, function(){
                        this.saveDiscount()
                    });
                })
            }
            else{
                let selected_discount_details = this.state.discount_list.filter(item => item.id === id);
                this.setState({selected_discount: id, selected_disDetails: selected_discount_details[0], isApply: true});
        
                var per_dis = 0;
                var ticket_with_dis = 0;
                //Discount Percentage Amt Calculation
                if(selected_discount_details[0].discount_type === 'percentage'){
                    per_dis = Number(selected_discount_details[0].discount_value/100)* Number(this.state.ticket_grandTotal);
                }else{
                    per_dis = selected_discount_details[0].discount_value;
                }
                ticket_with_dis = Number(this.props.ticket_service_total) - per_dis;
                this.setState({ticket_with_dis : ticket_with_dis,discount_value: per_dis }, function(){
                    this.saveDiscount()
                });
            }
            
        }
    }
    handleCloseDiscounts() {
        this.props.afterSubmitDiscount('');
    }
    resetDiscount(){
        this.setState({ticket_grandTotal: this.props.ticket_service_total,discount_value: 0,ticket_with_dis : 0, selected_discount:'',
        selected_disDetails:{}}); 
    }

    saveDiscount(){
        var dis_input = {
            dis_selected : Object.assign({}, this.state.selected_disDetails),
            discount_value: this.state.discount_value,
            ticket_with_discount : this.state.ticket_with_dis
        }  
        if(this.props.ticket_service_total < this.state.discount_value){
            this.resetDiscount()
        }
        this.props.afterSubmitDiscount('Applied Sucessfully',dis_input, 'apply');
    }
    render() {
        return (
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap',height:'450px', overflow:'auto', padding: '0 20px'}}> 
                    <Grid item xs={12}>
                        <div style={{height:'100%', width:'100%', display:'flex', flexWrap:'wrap'}}>
                        {this.state.discount_list.map((dis, index) => (
                            <Grid item xs={3} style={{height:'100px', paddingRight: 2,paddingLeft: 2, paddingTop:2,paddingBottom:2
                            }} >
                                <div style={{'background':(this.state.selected_discount===dis.id ? '#bee1f7':'#F2F2F2'), textTransform:'capitalize',
                            borderRadius: 10,'color':(this.state.selected_discount===dis.id ? '#000':'#000'), display:'flex', alignItems:'center', justifyContent:'center',
                            marginLeft:(index>0)?10:0, cursor: 'pointer', height:70 }} onClick={() => this.getDiscount(dis.id)}>
                                 
                                         <Box
                                                          fontSize="subtitle2.fontSize"
                                                          component="div" 
                                                          overflow="hidden"            
                                                          whiteSpace="post-line"
                                                          textOverflow="ellipsis" 
                                                          style={{background:"", maxHeight:'75%', textAlign: 'center', width: '100%',marginLeft:2,marginRight:2 }}  
                                                        >
                                                          {dis.name}<br/>
                                                          {dis.discount_type === 'percentage' ? dis.discount_value+"%" : "$"+dis.discount_value}
                                                        </Box>
                                        </div>
                            </Grid>
                        ))} 
                        </div>
                    </Grid> 
                    {/* <Grid item xs={12} style={{padding:'20px'}}> 
                        <Grid item xs={12} style={{display:'flex', flexWrap:'wrap'}}>
                        <Typography variant="subtitle2" align="center">  
                            Ticket GrandTotal : ${Number(this.state.ticket_grandTotal.toString()).toFixed(2)}
                         </Typography>
                        </Grid>

                        <Grid item xs={12} style={{display:'flex', flexWrap:'wrap'}}>
                        <Typography variant="subtitle2" align="center"> 
                            Discount value {this.state.selected_disDetails.discount_type === undefined ? '--' : this.state.selected_disDetails.discount_type === 'amount' ? '$ '+this.state.selected_disDetails.discount_value : this.state.selected_disDetails.discount_value+'%'} : ${Number(this.state.discount_value.toString()).toFixed(2)}
                        </Typography>
                        </Grid>

                        <Grid item xs={12} style={{display:'flex', flexWrap:'wrap'}}>
                        <Typography variant="subtitle2" align="center"> 
                            Ticket With Discount : ${Number(this.state.ticket_with_dis.toString()).toFixed(2)}
                        </Typography>
                        </Grid>
                       

                    </Grid> */}
                </Grid>
               
        )
    }
}
export default Discounts;
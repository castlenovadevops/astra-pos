import React from 'react';
import { Grid,Typography} from '@material-ui/core/';   
import HTTPManager from '../../../../utils/httpRequestManager';
export class TaxListComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state={
            taxlist:[]
        }
    }


    componentDidMount(){
        this.httpManager.postRequest("merchant/tax/getActive",{data:"TICKET"}).then(res=>{
         this.setState({taxlist: res.data})
        })
     }
 
    isTaxCheck(id){ 
        var servicetaxes = this.props.data.selectedServices[this.props.data.selectedRow].ticketservicetaxes.map(t=>t.mTaxId.toString());
        if(servicetaxes.indexOf(id.toString()) !== -1 ){
            return true
        }

        return false;
    }

    render(){
        return <Grid item xs={12} style={{display:'flex', flexWrap:'wrap',padding: 0}}>   
            {this.state.taxlist.map ((tax,index)=>(
                <Grid item xs={6}   alignItems='center'
                justify="center" justifyContent="center" onClick={(e) => this.props.data.selectTax(tax)}  
                style={{border:'2px solid #e0e0e0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', background: this.isTaxCheck(tax.mTaxId) ? '#bee1f7':'transparent',
                alignItems:'center', justifyContent:'center',cursor:'pointer'}}>
                
                <Grid item  style={{background: 'transparent'}}>
                    <Typography id="modal-modal-title" variant="subtitle2"  
                    style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                    align="center"> 
                    {tax.mTaxName} 
                    </Typography>

                    <Typography id="modal-modal-title" variant="subtitle2"  
                    style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                    align="center"> 
                    {(tax.mTaxType==="Percentage")?tax.mTaxValue+"%":"$"+tax.mTaxValue} 
                    </Typography>
                    </Grid>

                </Grid>  
            ))}
        </Grid> 
    }
}
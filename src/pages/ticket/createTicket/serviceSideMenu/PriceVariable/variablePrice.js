import React from 'react';
import { Grid, Typography, Button,Box,   InputAdornment} from '@material-ui/core/';
import TextField from '@mui/material/TextField';  


class VariablePrice extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            service_cost : "",
            isDiabled: true
        }
        this.handlechange = this.handlechange.bind(this)
        this.saveValue = this.saveValue.bind(this)
        
    }
    componentDidMount(){ 
       
      


    } 


    handlechange(e){
        if((e.target.value.match( "^.{"+7+","+7+"}$")===null)) {
            // console.log(e.target.value.length)
            if(e.target.value.length>=1) {
                this.setState({isDiabled: false})
            }
            else {
                this.setState({isDiabled: true})
            }
            this.setState({service_cost: e.target.value})
           
           
          }
       
    }


    saveValue() {
        this.props.data.afterSubmitVariablePrice(this.state.service_cost)
    }

    cancelValue() {
        this.props.data.closePopup()
    }

   
    render() {
       
        return (
            <Box style={{padding: 20}}>
                <Grid container spacing={2}>   

                    <Grid container justify="center" xs={12} style={{padding:'10px',paddingLeft: 20, alignContent: 'center'}}>
                                    <Typography variant="subtitle2" align="left"> 
                                        {this.props.data.service.mProductName}
                                    </Typography>
                                   
                                    
                    </Grid>
                                    
                    <Grid container justify="center" xs={12} style={{padding:'10px',paddingLeft: 20, alignContent: 'center'}}>         
                    <TextField  
                                                required 
                                                type="number" 
                                                placeholder="Enter Amount" 
                                                value={this.state.service_cost}
                                                name="variable_price"
                                                color="secondary"   
                                                variant="standard" 
                                                style={{background: 'white', paddingLeft: 20}}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                onChange={this.handlechange}
                                                onKeyDown={(e)=>{
                                                    if(e.key == 'e'  || e.key == "+" || e.key == "-"){
                                                        e.preventDefault();
                                                    }
                                                    if(e.key == "." && (e.target.value=="" || e.target.value.length==0) ) {
                                                      
                                                        e.preventDefault();
                                                       
                                                    }
                                                }

                                                }
                                            />
                 
                 </Grid>
                    <Grid item xs={12} style={{display:'flex', marginTop: 20, marginBottom: 20}}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4} style={{display:'flex'}}>
                            <Button style={{marginRight: 10}} color="secondary" onClick={()=>this.saveValue()} fullWidth variant="contained" 
                            disabled={this.state.isDiabled}>Save</Button>
                            <Button color="secondary" fullWidth variant="outlined" onClick={() => this.cancelValue()} >Cancel</Button>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>


                </Grid>
            </Box>
        )
    }
}
export default VariablePrice;
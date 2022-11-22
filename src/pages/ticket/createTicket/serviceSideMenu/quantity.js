import React from 'react';
import { Grid, Box, FormControl, TextField, Button} from '@material-ui/core/';   

export default class QuantityComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {
            qty: 1
        }
    }     

    componentDidMount(){
        if(this.props.data.qty !== undefined){
            this.setState({qty: this.props.data.qty})
        }
    }

    

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.data.qty !==prevState.qty){
            return { qty: nextProps.data.qty};
        } 
        else return null;
     }

    render(){
       return  <Grid item xs={12} style={{flexWrap:'wrap',padding: 20}}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <FormControl fullWidth>  
                                    <TextField 
                                        id="qty"  
                                        type="number"
                                        name="qty"  
                                        placeholder="Enter Quantity" 
                                        value={this.state.qty}
                                        color="secondary"   
                                        variant="outlined" 
                                        className='qtyfield'
                                        style={{textAlign:'center', border:0 }}
                                        InputProps={{
                                            startAdornment:<Button
                                                title="-1"
                                                aria-label="-1"
                                                size="medium" 
                                                style={{border:0, fontSize:'18px'}}
                                                onClick={()=>{
                                                    var qty = Number(this.state.qty) > 1 ? Number(this.state.qty)-1 : 1; 
                                                    this.props.data.onUpdateQuantity(qty); 
                                                }}
                                                variant="outlined"
                                            >
                                                -  
                                            </Button>,
                                            endAdornment: <Button
                                            title="+1"
                                            aria-label="+1"
                                            size="medium" 
                                            style={{border:0, fontSize:'18px'}}
                                            onClick={()=>{  
                                                var qty = Number(this.state.qty) >= 1 ? Number(this.state.qty)+1 : 1; 
                                                this.props.data.onUpdateQuantity(qty);
                                            }}
                                            variant="outlined"
                                        >
                                            +  
                                        </Button>
                                          ,
                                        }} 
                                    />

                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={12} style={{display:'flex',marginTop: 20}}> 
                    </Grid>
                    
                </Grid>
    }

}
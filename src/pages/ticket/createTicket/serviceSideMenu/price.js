import React from 'react';
import { Grid,Typography, TextField} from '@material-ui/core/';    
import _ from 'lodash';
export default class PriceComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {
            perunit_cost: 1
        }
        this.handlekeypress= this.handlekeypress.bind(this);
    }     

    componentDidMount(){
        if(this.props.data.perunit_cost !== undefined){
            this.setState({perunit_cost: this.props.data.perunit_cost})
        }
    }

    

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.data.perunit_cost !==prevState.perunit_cost){
            return { perunit_cost: nextProps.data.perunit_cost};
        } 
        else return null;
     }

     handlekeypress(e){
        // if(e.key === 'e'  || e.key === "+" || e.key === "-" || !RegExp("[0-9]+([.][0-9]+)?").test(e.target.value)){
        //     e.preventDefault();
        // }
        // if(e.key === "."  && (e.target.value==="" || e.target.value.length===0) ) {
        //     e.preventDefault(); 
        // }
    }
    render(){
       return  <Grid item xs={12} style={{ flexWrap:'wrap',padding: 20}}>
                    <Grid item xs={12}>
                        <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{maxHeight:'70px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>
                        <b>Original Price: &nbsp; {this.props.data.price}</b> 
                            <br/><br/>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <TextField id="service_price" 
                        required 
                        type="text"
                        name="service_price"  
                        label="Service Price" 
                        value={this.state.perunit_cost} 
                        onChange={(e)=>{
                            this.props.data.onUpdatePrice(e.target.value);
                        }}
                        onKeyDown={(e)=>{
                            console.log(e.keyCode)
                            const pattern = /^[0-9]$/;  
                            console.log(pattern.test(e.key))
                            if(!pattern.test(e.key)&& e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){ 
                                e.preventDefault();
                            }
                            this.handlekeypress(e)
                        }}
                        fullWidth 
                        style={{color:  '#134163'}} 
                        />
                    </Grid> 
                </Grid>
    }

}
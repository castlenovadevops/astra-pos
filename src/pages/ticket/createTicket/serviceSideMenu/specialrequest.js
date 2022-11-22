import React from 'react';
import { Grid,  Button, TextField} from '@material-ui/core/';    

export default class ServiceNotesComponent extends React.Component{

    constructor(props){
        super(props);  
        this.state = {
            requestNotes: ''
        }
    }     

    componentDidMount(){
        if(this.props.data.requestNotes !== undefined){
            this.setState({requestNotes: this.props.data.requestNotes})
        }
    }

    

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.data.requestNotes !==prevState.requestNotes){
            return { requestNotes: nextProps.data.requestNotes};
        } 
        else return null;
     }

    render(){
       return  <>
            <Grid item xs={12} style={{display:'flex', flexWrap:'wrap', marginTop:'1rem' , padding:'10px'}}> 
                <TextField
                    fullWidth
                    label="Service Notes"
                    name="Service Notes" 
                    id="Service Notes"
                    rows={20}
                    required
                    multiline
                    variant="standard"
                    value={this.state.requestNotes}
                    onChange={(e) => { 
                        this.props.data.onUpdateRequestNotes(e.target.value.substring(0,200)) 
                    }} 
                />
            </Grid>  

            <Grid item xs={12}>
                    <Button style={{marginLeft: 10 , background:'#134163', color:'#fff'}} onClick={()=>{
                        this.props.data.onUpdateSpecialRequest(0);
                    }}  variant="contained">Remove Request</Button>
            </Grid> 
        </>
    }

}
import React from "react"; 
import {Grid} from '@mui/material';
 
export default class TicketListComponent extends React.Component{


    constructor(){
        super();
        this.state={
            userdetail:{}, 
            isLoading: false, 
        }  
    } 

    render(){
        return  <Grid container className='fullWidth fullHeight'>
                    <Grid item xs={12}  className='fullWidth fullHeight'>
                            <Grid item xs={12} style={{height:'100px', background:'red'}} className='fullWidth'>

                            </Grid>
                            <Grid item xs={12} style={{height:'calc(100% - 100px)', background:'blue'}} className='fullWidth'>
                                <Grid item xs={8} className='fullHeight'>
                                    <Grid item xs={12} style={{height:'calc(100% - 300px)', background:'blue'}} className='fullWidth'>

                                    </Grid>
                                    <Grid item xs={12} style={{height:'200px', background:'gray'}} className='fullWidth'>

                                    </Grid>

                                    <Grid item xs={12} style={{height:'100px', background:'green'}} className='fullWidth'>

                                    </Grid>
                                </Grid>
                                <Grid item xs={4} className='fullHeight'>

                                </Grid>
                            </Grid>
                    </Grid>
            </Grid> 
    }
}
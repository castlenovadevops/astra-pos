import React from 'react';
import { Grid } from '@mui/material';
export default class ServiceSideMenu extends  React.Component{
    constructor(props){
        super(props);
        this.state={
            selectedRow:-1,
            menulist:[
                {id:0 , label:"Show Menu" }, 
                {id:1 , label:"Technicians" },
                {id:2 , label:"Transfer" },
                {id:3 , label:"Quantity" },
                {id:4 , label:"Change Price" },
                {id:5 , label:"Void Item" },
                {id:6 , label:"Split Item" },
                {id:7 , label:"Request" },
                {id:8 , label:"Discount" },
                {id:9 , label:"Tax" }
            ]
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) { 
        if (nextProps.data.selectedRow !==  prevState.selectedRow) { 
            return {selectedRow: nextProps.data.selectedRow}
        }
    }

    componentDidMount(){
        this.getCategories()
    }


    render(){
        return <Grid container style={{height:'100%'}}>
            <Grid item xs={12} style={{height:'100%'}}>
                <Grid item xs={4} className='sideMenu' style={{ height:'100%', overflow:'auto'}}>
                    {this.state.selectedRow !== -1 &&
                     <Grid container>
                        {this.state.menulist.map(menu=>{ 
                            return <Grid item xs={12}>
                                {menu.label}
                            </Grid> }) 
                        }
                    </Grid>
                    }
                </Grid>
                <Grid item xs={8} style={{borderLeft:'1px solid #dfdfdf', height:'100%', overflow:'auto'}}>

                </Grid>
            </Grid>
        </Grid>
    }
}
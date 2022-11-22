import React from 'react';
import { Grid, Typography} from '@material-ui/core/';   
import HTTPManager from '../../../../utils/httpRequestManager';
import CircularProgress from '@mui/material/CircularProgress';
export default class TechniciansComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props);  
        this.state = {
            emp_list:[],
            isLoading: false
        }
    }    

    componentDidMount(){
        this.setState({isLoading: true})
        this.httpManager.postRequest('merchant/employee/getTechnicians', {type:"clockedin"}).then(res=>{
            this.setState({emp_list:res.data, isLoading: false})
        });
    }

    render(){
        return <>  
            {this.state.isLoading && <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CircularProgress className='loader'
                    size={30} ></CircularProgress>
            </div>}
            <Grid item xs={12} style={{display:'flex', flexWrap:'wrap', height:'100px'}}>
                {this.state.emp_list.map((emp, index) => (  
                <Grid item xs={6}  className='servicebox'
                        onClick={(e) => this.props.data.onChangeTechnician(emp)}  >
                        
                            <Typography  className='serviceLbl' id="modal-modal-title" variant="subtitle2" align="center" >
                            {emp.mEmployeeFirstName+" "+emp.mEmployeeLastName} </Typography></Grid>  
                ))}
            </Grid>
        </>
    }
}
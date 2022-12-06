import React from 'react';
import { Grid, Typography, Button,Box, FormControl,InputAdornment} from '@material-ui/core/';
import {TextField, Select, MenuItem} from '@mui/material';
import LoadingModal from '../../../../components/Loader';  
import HTTPManager from '../../../../utils/httpRequestManager';

class SplitService extends React.Component  {
    httpManager = new HTTPManager()
    constructor(props) {
        super(props);
        this.state={  
            service_selected: {},  
            users:[],
            split_type: "equal",
            splittedservice:[],
            totalcost:0,
            canaddSplit: true,
            isDisabled: false,
            isLoading: false,
            isDisabledSelect: false,
            employee_list:[]
        } 
        this.checkForm = this.checkForm.bind(this)
    }
    componentDidMount(){ 
        this.getClockinEmployee()
        if(this.state.splittedservice.length === 0) {
            this.setState({isDisabled:true});
        }
       
    } 

    getClockinEmployee() {
        this.setState({isLoading: true}) 
        
        this.httpManager.postRequest('merchant/employee/getTechnicians', {type:"clockedin"}).then(res=>{
             this.setState({users : res.data, employee_list:res.data , isLoading:false}, function(){
                this.getServices();
            });  
        }); 
    } 

    getServices() {
        if(this.props.data.selectedRow !== undefined){
            var service = [];
            var input = {};
            input = Object.assign({},this.props.data.selectedServices[this.props.data.selectedRow])
            input.process = "Splitted"; 
            service.push(input);   
            this.setState({service_selected:Object.assign({}, this.props.data.selectedServices[this.props.data.selectedRow]), users: this.state.employee_list,splittedservice:service}, function() { 
                if(this.state.employee_list.length === 1) {
                    this.setState({canaddSplit: false,  isDisabledSelect: true })
                }  
            }); 
        }
    } 
 
    checkStatus(){
        return    this.state.split_type === 'manual' ? false : true;
    }

    handlekeypress(e){ 
        // console.log("handlekeypress",e.key)
        if(e.key === 'e'  || e.key === "+" || e.key === "-"){
            e.preventDefault();
        }
        if(e.key === "." && (e.target.value === "" || e.target.value.length === 0) ) {
            e.preventDefault(); 
        } 
    }

    handlechangeindividual_amt(e,idx){  
        if(e.target.value.length <=5) {
            var splitted = Object.assign([], this.state.splittedservice)
            splitted[idx].perunit_cost = e.target.value;
            splitted[idx].subtotal = Number(e.target.value).toFixed(2); 
            this.setState({splittedservice: splitted}, function() {
                this.calcaulateTotal();
                this.checkForm()
            });
        }  
    }


    calcaulateTotal(){
        var total = 0;
        this.state.splittedservice.forEach((elmt, i)=>{ 
            total += Number(elmt.perunit_cost);
            if(i === this.state.splittedservice.length-1){
                this.setState({totalcost:total });
            }
        })
    }

    addNewSplit(){ 
            var input =  {};
            input = Object.assign({},this.state.service_selected); 
            console.log(this.state.service_selected) 
            input.process = "Splitted";
            input.employee_id = 0; 
            var splitted = Object.assign([],this.state.splittedservice);
            splitted.push(input);
            var cost = 0;
            if(this.state.split_type === 'equal'){ 
                cost = Number(this.state.service_selected.perunit_cost)/splitted.length;
            } 
            var items =[];  
            if(cost <= 0.05 || splitted.length === this.state.users.length){
                this.setState({canaddSplit: false})
            } 
            splitted.forEach((elmt,i) =>{
                elmt.perunit_cost = Number(cost).toFixed(2); 
                elmt.subtotal = Number(cost).toFixed(2); 
                items.push(elmt);
                if(i === splitted.length-1){
                    this.setState({splittedservice:items}, function(){
                        this.checkForm();
                    });
                }
            }) 
    }


    checkForm(){ 
        this.setState({isDisabled:false});
        this.state.splittedservice.forEach((m, i)=>{
            if(m.technician.mEmployeeId === null || m.technician.mEmployeeId === undefined || m.technician.mEmployeeId === 0 || m.technician.mEmployeeId === 'undefined'){ 
                this.setState({isDisabled:true}, function() {});
            } 
        })  
    }

    saveSplit(){ 
        this.props.data.onSaveSplit(this.state.splittedservice);         
    }

    renderMenuItem(index){
        var menuitems = [];
        var services = this.state.splittedservice.filter((e, i)=>i !== index);
        var emps = services.map(e=>e.technician.mEmployeeId);
        var selectableusers = this.state.users.filter(e=> this.state.splittedservice[index].technician.mEmployeeId === e.id ||  emps.indexOf(e.id) === -1); 
        console.log(selectableusers)
        selectableusers.forEach((v,i)=>{ 
            menuitems.push(<MenuItem value={v} key={i}>{v.mEmployeeFirstName+' '+v.mEmployeeLastName}</MenuItem>) 
        })
        return menuitems;
    }

    render() {
        const v = this.state.service_selected; 
        console.log("render::",this.state.isDisabled)
        return(<>
            {v.serviceDetail !== undefined && <Box style={{padding: 20,  height: '100%', borderRadius: 10}}>
                {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
            <div style={{position: 'relative', height: '100%'}}>
            <Grid container spacing={2} style={{height: '80%',}}>  

                <Grid item xs={12} style={{display:'flex'}}> 
              
                {this.state.split_type === 'equal'  && <Grid item xs={6} style={{padding:'10px'}}>
                <Button style={{height:'100%'}}   
                onClick={()=>{this.setState({'split_type':'equal'})}}  fullWidth variant="contained">  evenly </Button>
            </Grid> } 
        {this.state.split_type!== 'equal'  && <Grid item xs={6} style={{padding:'10px'}}>
                <Button style={{height:'100%'}}  
                onClick={()=>{this.setState({'split_type':'equal'})}}  fullWidth variant="outlined">  evenly </Button>
            </Grid> } 
            {this.state.split_type === 'equal' && <Grid item xs={6} style={{padding:'10px'}}>
                <Button style={{height:'100%' }}  onClick={()=>{

                    this.setState({'split_type':'manual'}) 
                }}  fullWidth variant="outlined">  Manual </Button>
            </Grid>}
            {this.state.split_type === 'manual' &&<Grid item xs={6} style={{padding:'10px'}}>
                <Button style={{height:'100%' }}  onClick={()=>{
                    this.setState({'split_type':'manual'})
                }}  fullWidth variant="contained">  Manual </Button>
            </Grid>}
                </Grid> 

               <Grid container xs={12} style={{marginTop: 20, padding:'0 10px'}}>
                    <Grid item xs={6} style={{padding:'10px'}}>
                    <Typography variant="subtitle2" align="left">  
                        Service : <b>{v.serviceDetail.mProductName}</b><br/>
                        Quantity : <b>{v.qty}</b><br/>
                        Cost : <b>{v.perunit_cost}/unit</b><br/>
                    </Typography>
                    </Grid>
                    <Grid item xs={6} alignItems='flex-end' justify='flex-end' style={{padding:'10px', display:'flex'}}>
                    <Button variant="contained" style={{height:'100%', maxHeight:'50px'  }} disabled={!this.state.canaddSplit}  onClick={()=>{this.addNewSplit();}}>Split</Button>
                    </Grid>
                </Grid> 


                <div style={{ width: '100%', height: '50%',overflow: 'hidden',background: '',}}>
                <div style={{width: '100%',  height: "100%",overflowY:'auto' ,background: '',paddingLeft: 0,paddingTop: 10,paddingBottom: 10 }}>
                {this.state.splittedservice.map((v,index)=>{
                    return (
                        <Grid container xs={12} > 
                                <Grid item xs={9} style={{padding:'10px',paddingLeft: 20}}>
                                <Typography variant="subtitle2" align="left"> 
                                <FormControl fullWidth> 
                                        <Select
                                            label="Technician"
                                            id="Technician" 
                                            value={this.state.splittedservice[index].technician}
                                            variant="standard"
                                            placeholder="Select Technician"
                                            name="userId"
                                            disabled={this.state.isDisabledSelect}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            onChange={(e)=>{
                                                var services = this.state.splittedservice;
                                                //console.log(index);
                                                services[index].technician=e.target.value;
                                                //console.log(services);
                                                this.setState({splittedservice:services}, function(){
                                                    this.checkForm();
                                                    if(this.state.splittedservice.length === 0) {
                                                        this.setState({isDisabled:true});
                                                    }
                                                  
                                                });
                                            }}
                                        >
                                            <MenuItem value={0}>Select Staff</MenuItem>
                                            {this.renderMenuItem(index)}

                                        
                                        </Select>
                                    </FormControl>
                                </Typography>
                                </Grid> 
                                <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}> 
                                    <TextField  
                                        required 
                                        // type="number" 
                                        placeholder="Enter Amount" 
                                        value={this.state.splittedservice[index].perunit_cost}
                                        color="secondary"   
                                        variant="standard" 
                                        maxLe
                                        disabled={this.checkStatus()}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            // inputComponent: NumberFormatCustom
                                        }}
                                        onChange={(e)=>{
                                            this.handlechangeindividual_amt(e,index);
                                        }}
                                        onKeyDown={this.handlekeypress}
                                    /> 

                                </Grid>
                            </Grid>
                    )
                })} 
                </div>
                </div>


                


            </Grid>

            <Grid item xs={12} style={{display:'flex', position: 'absolute',bottom:'0', height: 60,width: '100%', background: '', marginBottom: 0 }}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{display:'flex'}}>
                        <Button style={{marginRight: 10}} variant={"contained"}  color="primary" disabled={this.state.splittedservice.length===1 ? true : (this.state.isDisabled)} onClick={()=>{  this.saveSplit()}} fullWidth >Save</Button>
                        <Button color="primary" fullWidth variant="outlined" onClick={() => this.props.data.closeSplit()} >Cancel</Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </div>
        </Box>} </>
        ) 
    }
}
export default SplitService;
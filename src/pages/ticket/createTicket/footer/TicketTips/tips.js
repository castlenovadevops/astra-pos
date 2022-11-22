import React from 'react';
import { Grid, Typography, Button,Box,  InputAdornment, FormControl, FormControlLabel, RadioGroup, Radio} from '@material-ui/core/';
import TextField from '@mui/material/TextField'; 

import {NumericFormat} from "react-number-format";

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumericFormat
        {...other}
        maxLength={props.maxLength} 
        getInputRef={inputRef}
        onChange={
            event =>{
                  onChange({
                        target: {
                        name: props.name,
                        value: event.target.value
                        }
                    });
            }
        }
        // onValueChange={values => {
        //   onChange({
        //     target: {
        //       name: props.name,
        //       value: values.value
        //     }
        //   });
        // }}
        allowLeadingZeros thousandSeparator="," 
        // isNumericString
      />
    );
  }

class Tips extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            tips_amount: 0,
            tips_type:'equal',
            isemp_selected: false,
            individual_tips_amount:[],
            selectedServices: [],
            selected_emp: [{service:{},tips_amt:0}],
            tips_percent: 0,
            total_tips: 0,
            isDisable: false,
            showError:true
        }
        this.handlechangeTips_amt = this.handlechangeTips_amt.bind(this) 
        this.handlechangeTips_individual_amt = this.handlechangeTips_individual_amt.bind(this)
        this.saveTips = this.saveTips.bind(this)
        this.handleemp_selected = this.handleemp_selected.bind(this)
    }
    componentDidMount(){  
        if(this.props.selectedServices !== undefined){
            this.setState({selectedServices : this.props.selectedServices, total_tips : this.props.total_tips, tips_type:this.props.tips_type, tips_percent:this.props.tips_percent});
            var indtips =[];
            // console.log(this.props)
            this.props.selectedServices.forEach((e,idx)=>{
                var obj = Object.assign({}, e); 
                if(obj["tips_amount"] === undefined)
                    obj["tips_amount"] = 0;
                indtips.push(obj);
                if(idx === this.props.selectedServices.length-1){
                    if(this.props.total_tips > 0){
                        var percent = this.props.total_tips
                        if(this.props.tips_type === 'percent'){
                            percent = this.props.tips_percent;
                        }
                        this.setState({tips_amount: this.props.total_tips, tips_percent:percent}, function(){
                            this.calculateTips();
                        });
                    }
                    this.setState({selectedServices:indtips},function(){
                        // this.setState({tips_type: 'equal'});
                    })
                }
            })
        }
        else{
            setTimeout(()=>{
                this.setState({'tips_type':'equal'})
            },2000)
        }

    }  
    handlechangeTips_percent(e){
        if((e.target.value.match( "^.{"+6+","+6+"}$")===null)) {
        this.resetTips();
        this.setState({tips_percent: e.target.value,tips_amount:e.target.value, total_tips: 0}, function(){
            this.calculateTips();
        });
        }
    }

    resetTips(){
        var amtfields = [];
        this.setState({tips_amount:0, tips_percent:0, total_tips:0});
        //console.log("reset tips",this.state.selectedServices);
        this.state.selectedServices.forEach((elmt, i)=>{
            elmt["tips_amount"] = 0;
            amtfields.push(elmt);
            if(i === this.state.selectedServices.length-1){
                this.setState({selectedServices:amtfields });
            }
        });
    }

    calculateTips(){ 
        console.log("caliling")
        if(this.state.tips_type === 'equal'){
            var amount =( this.state.tips_amount / this.state.selectedServices.length).toFixed(2);
            var amtfields = [];
            this.state.selectedServices.forEach((elmt, i)=>{                
                elmt["totalTips"] = amount;
                amtfields.push(elmt);
                if(i === this.state.selectedServices.length-1){
                    this.setState({selectedServices:amtfields }, ()=>{
                        this.calcaulateTotal()
                    });
                }
            }) 
        }
        else if(this.state.tips_type === 'percent'){
            var amtfields = [];
            var totalamt = 0;
            var totaltipsamt = 0
            this.state.selectedServices.forEach((elmt, i)=>{ 
                totalamt+=Number(elmt.perunit_cost)

            })

            this.state.selectedServices.forEach((elmt, i)=>{ 
                var amount = ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent)).toFixed(2);
                elmt["totalTips"] = amount;
                amtfields.push(elmt);
                totaltipsamt+= ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent))
                if(i === this.state.selectedServices.length-1){
                    this.setState({selectedServices:amtfields, total_tips:Number(totaltipsamt).toFixed(2) }, ()=>{
                        this.calcaulateTotal()
                    });
                }
               

            })

           
        }
        else{
            var amtfields = [];  

            this.state.selectedServices.forEach((elmt, i)=>{ 
                var amount = 0.00;
                elmt["totalTips"] = amount;
                amtfields.push(elmt); 
                if(i === this.state.selectedServices.length-1){
                    this.setState({selectedServices:amtfields, total_tips:Number(totaltipsamt).toFixed(2) }, function() {
                        this.calcaulateTotal();
                    });
                }
               

            })

        }
        // else if(this.state.tips_type === 'percent'){
        //     var amtfields = [];
        //     var totalamt = 0;
        //     var totaltipsamt = 0
        //     this.state.selectedServices.forEach((elmt, i)=>{ 
        //         totalamt+=Number(elmt.perunit_cost)

        //     })
        //     console.log("totalamt:",totalamt)

        //     // this.state.selectedServices.forEach((elmt, i)=>{ 
        //     //     var amount = ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent)).toFixed(2);
        //     //     elmt["totalTips"] = amount;
        //     //     amtfields.push(elmt);
        //     //     totaltipsamt+= ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent))
        //     //     if(i === this.state.selectedServices.length-1){
        //     //         this.setState({selectedServices:amtfields, total_tips:Number(totaltipsamt).toFixed(2) }, function() {
        //     //         });
        //     //     }
               

        //     // })
        // }


    }


    handlekeypress(e){
        // console.log("handlekeypress", e.target.value)
        if(e.key === 'e'  || e.key === "+" || e.key === "-"){
            e.preventDefault();
        }
        if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) {
            
            e.preventDefault();
           
        }
        
    }

    handlechangeTips_amt(e){ 
        this.setState({tips_amount: e.target.value, tips_percent:e.target.value, total_tips: e.target.value}, function(){
            this.calculateTips()
        });
    }
    handleCloseTips(){
        this.resetTips();
        this.props.afterSubmitTips();
    }
    handleradio(e){
        this.setState({tips_type: e.target.value})
    }
    handleemp_selected(event,service)
    {
        if (event.target.checked){
            event.target.removeAttribute('checked');
        }else{
            event.target.setAttribute('checked', true);
        }
        var empArr = this.state.selected_emp;
        empArr.service.push(service);
        this.setState({selected_emp: empArr});
        
    }

    calcaulateTotal(){
        var total = 0;

        this.setState({showError: false})
        console.log("calcaulateTotal caliling")
        var isfilled=0
        this.state.selectedServices.forEach((elmt, i)=>{ 
            total += Number(elmt.totalTips);
            if(Number(elmt.totalTips) > 0){
                isfilled +=1;
            }
            if(i === this.state.selectedServices.length-1){
                this.setState({total_tips:total },function(){
                    if(this.state.total_tips !== Number(this.state.tips_amount) && this.state.tips_type === 'manual'){
                        this.setState({isDisable: true});
                        console.log("total_tips",this.state.total_tips);
                        console.log("totalTips",this.state.tips_amount, isfilled);
                        if(this.state.selectedServices.length === isfilled  && this.state.tips_type==='manual'){
                            console.log("total_tips 1",this.state.total_tips);
                            console.log("totalTips 1",this.state.tips_amount);
                            this.setState({showError: true})
                        }
                    }
                    else{
                        this.setState({isDisable: false});
                    }
                });
            }
        })
    }
    handlechangeTips_individual_amt(e,index){
        if((e.target.value.match( "^.{"+6+","+6+"}$")===null)) {
        var tips = Object.assign([], this.state.selectedServices);
        tips[index].totalTips = e.target.value;
        this.setState({selectedServices: tips}, function(){
            //console.log(this.state.selectedServices)
            this.calcaulateTotal();
        });
        }
        // //console.log("artertyurtsdasdasdasd");
        // var empArr = this.state.selected_emp[index];
        // empArr.tips_amt = e.target.value;
        // this.setState({selected_emp: empArr});
    }
    saveTips(){
       

        var tips_input = {
            tips_type: this.state.tips_type,
            totalTips: Number(this.state.total_tips), 
            tips_percent:  Number(this.state.tips_percent),
            selectedServices: this.state.selectedServices
        }
        
        this.props.afterSubmitTips('Added Sucessfully',tips_input);
    }

    checkStatus(){
        return this.state.tips_type === 'manual' ? false : true;
    }

    render() {
        return (
            <Box>
                <Grid container spacing={0}>  
                   
                   {this.state.tips_type === 'equal' && <Grid container xs={12} style={{marginTop: 0 }}>
                        <Grid item xs={6} >
                        <Typography variant="subtitle1" align="left"> 
                            Tip amount ($)
                        </Typography>
                        </Grid>
                        <Grid item xs={6} >
                        <TextField  fullWidth
                                            id="tips_amount" 
                                            required 
                                            // type="number"
                                            name="tips_amount"  
                                            placeholder="Enter Tips Total" 
                                            value={this.state.tips_amount}
                                            color="secondary"   
                                            variant="standard" 
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                inputComponent: NumberFormatCustom
                                            }}
                                            onChange={(e)=>{
                                                this.handlechangeTips_amt(e)
                                            }}
                                            onKeyDown={(e)=>{
                                                if(e.target.value.length >=6   && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 46  && e.keyCode !== 37 && e.keyCode !== 39){
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }
                                                this.handlekeypress(e)
                                            }}
                                            
                                            
                                            
                                        />
                        </Grid>
                    </Grid> }
                    {this.state.tips_type === 'percent' && <Grid container xs={12} style={{marginTop: 0 }}>
                        <Grid item xs={6} >
                        <Typography variant="subtitle1" align="left"> 
                            Tip amount ($)
                        </Typography>
                        </Grid>
                        <Grid item xs={6} >
                        <TextField  fullWidth
                        
                                            id="tips_percent" 
                                            required 
                                            type="number"
                                            name="tips_percent"  
                                            placeholder="Enter Tips Total" 
                                            value={this.state.tips_percent}
                                            color="secondary"   
                                            variant="standard" 
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start"></InputAdornment>,
                                                
                                            }}
                                            onChange={(e)=>{
                                                this.handlechangeTips_percent(e)
                                            }}
                                            onKeyDown={(e)=>{
                                                this.handlekeypress(e)
                                            }}
                                            
                                        />
                        </Grid>
                    </Grid> }
                    {this.state.tips_type === 'manual' && <Grid container xs={12} style={{marginTop: 0 }}>
                        <Grid item xs={6} style={{padding:'10px'}}>
                        <Typography variant="subtitle1" align="left"> 
                            Tip amount ($)
                        </Typography>
                        </Grid>
                        <Grid item xs={6} style={{padding:'10px'}}>
                        <TextField  fullWidth
                                            id="tips_amount" 
                                            required 
                                            // type="number"
                                            name="tips_amount"  
                                            placeholder="Enter Tips Total" 
                                            value={this.state.tips_amount}
                                            color="secondary"   
                                            variant="standard" 
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                inputComponent: NumberFormatCustom
                                            }}
                                            onChange={(e)=>{
                                                this.handlechangeTips_amt(e)
                                            }}
                                            onKeyDown={(e)=>{
                                                this.handlekeypress(e)
                                            }}
                                            
                                            
                                            
                                        />
                        </Grid>
                    </Grid> } 
                    {this.state.selectedServices.length>1 &&
                    <Grid container xs={12} style={{marginTop: 0, padding:'0 10px'}}>
                        <Grid item xs={12} style={{padding:'10px', paddingLeft: 0}}>
                            <FormControl component="fieldset">
                                {/* <FormLabel component="legend">Select Type</FormLabel> */}
                                <RadioGroup row aria-label="tax" name="row-radio-buttons-group" style={{marginLeft: 10}}>
                                    <FormControlLabel value={this.state.tips_type} control={<Radio checked={this.state.tips_type === 'equal'} value="equal" onChange={(e)=>{ this.setState({'tips_type':'equal'},()=>{
                                         this.calculateTips()
                                    })  }}/>} label="Evenly" />
                                    <FormControlLabel value={this.state.tips_type} control={<Radio checked={this.state.tips_type === 'percent'} value="percent" onChange={(e)=>{ this.setState({'tips_type':'percent'}, ()=>{
                                         this.calculateTips()
                                    })  }}/>} label="$ of Service" />
                                    <FormControlLabel value={this.state.tips_type} control={<Radio checked={this.state.tips_type === 'manual'}  value="manual" onChange={(e)=>{ this.setState({'tips_type':'manual'},()=>{
                                        // this.resetTips();
                                        this.calculateTips()
                                    })  }} />} label="Manual" /> 
                                </RadioGroup>
                
                            </FormControl>
                        </Grid>      
                    </Grid> }

                    <Grid container xs={12} style={{marginTop: 0, padding:'0 10px'}}>
                        <Grid item xs={3} style={{padding:'10px'}}>
                        <Typography variant="subtitle1" align="left"> 
                            Service
                        </Typography>
                        </Grid>
                        <Grid item xs={3} style={{padding:'10px'}}>
                        <Typography variant="subtitle1" align="left"> 
                            Technician
                        </Typography>
                        </Grid>
                        <Grid item xs={3} style={{padding:'10px'}}>
                        <Typography variant="subtitle1" align="left"> 
                           Total ($)
                        </Typography>
                        </Grid>
                        <Grid item xs={3} style={{padding:'10px'}}> 
                        <Typography variant="subtitle1" align="left"> 
                            Tips ($)
                        </Typography>
                        </Grid>
                        </Grid>
                    <div style={{ width: '100%', height: '100%',overflow: 'hidden'}}>
                    <div style={{width: '100%', height:'auto',maxHeight:  200,paddingLeft: 0,paddingTop: 10,paddingBottom: 10,overflow:'hidden auto'}}>
                    {this.state.selectedServices.map((v,index)=>{
                        return (
                            <Grid container xs={12} >
                                    <Grid item xs={3} style={{padding:'10px', paddingLeft: 20}}>
                                    <Typography variant="subtitle1" align="left"> 
                                            {v.serviceDetail.mProductName}
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}>
                                    <Typography variant="subtitle1" align="left"> 
                                            {v.technician.mEmployeeFirstName+v.technician.mEmployeeLastName} 
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}>
                                    <Typography variant="subtitle1" align="left"> 
                                        {/* {v.perunit_cost+" X "+v.qty}   */}
                                        {v.subTotal}
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}> 
                                        <TextField  
                                            required 
                                            // type="number" 
                                            placeholder="Enter Amount" 
                                            value={this.state.selectedServices[index].totalTips}
                                            color="secondary"   
                                            variant="standard" 
                                            disabled={this.checkStatus()}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                inputComponent: NumberFormatCustom
                                                
                                            }}
                                            onChange={(e)=>{
                                                this.handlechangeTips_individual_amt(e,index);
                                            }}
                                            onKeyDown={(e)=>{
                                                this.handlekeypress(e)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                        )
                    })} 
                    </div>
                    </div>


                        {this.state.tips_type !== 'equal' &&  <Grid container xs={12} style={{marginLeft: 10,marginTop: 20, padding:'0 10px', marginBottom: 0}}> 
                            <Grid item xs={3} style={{padding:'0px'}}>
                            <Typography variant="subtitle1" align="left"> 
                                    Total Tips ($)
                            </Typography>
                            </Grid>
                            <Grid item xs={3} style={{padding:'0px'}}> 
                            <Typography variant="subtitle1" align="left"> 
                                ${Number(this.state.total_tips).toFixed(2)}
                            </Typography>
                            </Grid>
                           
                        </Grid> }

                        

                    <Grid item xs={12} style={{display:'flex', marginTop: 20, marginBottom: 20}}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4} style={{display:'flex'}}>
                            <Button style={{marginRight: 10}} disabled={this.state.isDisable} color="secondary" onClick={()=>this.saveTips()} fullWidth variant="contained">Save</Button>
                            <Button color="secondary" fullWidth variant="outlined" onClick={() => this.handleCloseTips()} >Cancel</Button>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                    {this.state.isDisable && this.state.showError &&<Grid item xs={12} style={{display:'flex', marginTop: 20, marginBottom: 20}}> 
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8} align="center"><p className='errormsg' style={{color:'#FF4842', padding:'0 10px'}}>Sum of Tips should be equal to Tips Amount</p></Grid>
                        <Grid item xs={2}></Grid>
                             
                        </Grid>}


                </Grid>
            </Box>
        )
    }
}
export default Tips;
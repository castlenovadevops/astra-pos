import React from 'react';
import { Grid, Typography, Button,Box,   InputAdornment, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio} from '@material-ui/core/';
import TextField from '@mui/material/TextField'; 

import NumberFormat from "react-number-format";
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      maxLength="5" 
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
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
            service_selected: [],
            selected_emp: [{service:{},tips_amt:0}],
            tips_percent: 0,
            total_tips: 0
        }
        this.handlechangeTips_amt = this.handlechangeTips_amt.bind(this) 
        this.handlechangeTips_individual_amt = this.handlechangeTips_individual_amt.bind(this)
        this.saveTips = this.saveTips.bind(this)
        this.handleemp_selected = this.handleemp_selected.bind(this)
    }
    componentDidMount(){ 

       
       

        if(this.props.service_selected !== undefined){
            this.setState({service_selected : this.props.service_selected, total_tips : this.props.total_tips, tips_type:this.props.tips_type, tips_percent:this.props.tips_percent});
            var indtips =[];
            // console.log(this.props)
            this.props.service_selected.forEach((e,idx)=>{
                var obj = Object.assign({}, e); 
                if(obj["tips_amount"] === undefined)
                    obj["tips_amount"] = 0;
                indtips.push(obj);
                if(idx === this.props.service_selected.length-1){
                    if(this.props.total_tips > 0){
                        var percent = this.props.total_tips
                        if(this.props.tips_type === 'percent'){
                            percent = this.props.tips_percent;
                        }
                        this.setState({tips_amount: this.props.total_tips, tips_percent:percent}, function(){
                            this.calculateTips();
                        });
                    }
                    this.setState({service_selected:indtips},function(){
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


    getEmployeeName(id){
        var empname = '';
        for(var i=0;i<this.props.employee_list.length;i++){
            var obj = this.props.employee_list[i];
            if(obj["id"] === id){
                empname = obj['firstName']+" "+obj['lastName'];
            }
        }
        return empname;
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
        //console.log("reset tips",this.state.service_selected);
        this.state.service_selected.forEach((elmt, i)=>{
            elmt["tips_amount"] = 0;
            amtfields.push(elmt);
            if(i === this.state.service_selected.length-1){
                this.setState({service_selected:amtfields });
            }
        });
    }

    calculateTips(){ 
        if(this.state.tips_type === 'equal'){
            var amount =( this.state.tips_amount / this.state.service_selected.length).toFixed(2);
            var amtfields = [];
            this.state.service_selected.forEach((elmt, i)=>{                
                elmt["tips_amount"] = amount;
                amtfields.push(elmt);
                if(i === this.state.service_selected.length-1){
                    this.setState({service_selected:amtfields });
                }
            }) 
        }
        else if(this.state.tips_type === 'percent'){
            var amtfields = [];
            var totalamt = 0;
            var totaltipsamt = 0
            this.state.service_selected.forEach((elmt, i)=>{ 
                totalamt+=Number(elmt.perunit_cost)

            })

            this.state.service_selected.forEach((elmt, i)=>{ 
                var amount = ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent)).toFixed(2);
                elmt["tips_amount"] = amount;
                amtfields.push(elmt);
                totaltipsamt+= ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent))
                if(i === this.state.service_selected.length-1){
                    this.setState({service_selected:amtfields, total_tips:Number(totaltipsamt).toFixed(2) }, function() {
                    });
                }
               

            })

           
        }
        // else if(this.state.tips_type === 'percent'){
        //     var amtfields = [];
        //     var totalamt = 0;
        //     var totaltipsamt = 0
        //     this.state.service_selected.forEach((elmt, i)=>{ 
        //         totalamt+=Number(elmt.perunit_cost)

        //     })
        //     console.log("totalamt:",totalamt)

        //     // this.state.service_selected.forEach((elmt, i)=>{ 
        //     //     var amount = ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent)).toFixed(2);
        //     //     elmt["tips_amount"] = amount;
        //     //     amtfields.push(elmt);
        //     //     totaltipsamt+= ( (elmt.perunit_cost/totalamt) * (this.state.tips_percent))
        //     //     if(i === this.state.service_selected.length-1){
        //     //         this.setState({service_selected:amtfields, total_tips:Number(totaltipsamt).toFixed(2) }, function() {
        //     //         });
        //     //     }
               

        //     // })
        // }


    }


    handlekeypress(e){
        // console.log("handlekeypress", e.target.value)
        if(e.key == 'e'  || e.key == "+" || e.key == "-"){
            e.preventDefault();
        }
        if(e.key == "." && (e.target.value=="" || e.target.value.length==0) ) {
            
            e.preventDefault();
           
        }
    }

    handlechangeTips_amt(e){ 

        if((e.target.value.match( "^.{"+6+","+6+"}$")===null)) {
        this.setState({tips_amount: e.target.value, tips_percent:e.target.value, total_tips: e.target.value}, function(){
            this.calculateTips()
        });
        }
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
            this.state.service_selected.forEach((elmt, i)=>{ 
                total += Number(elmt.tips_amount);
                if(i === this.state.service_selected.length-1){
                    this.setState({total_tips:total });
                }
            })
    }
    handlechangeTips_individual_amt(e,index){
        if((e.target.value.match( "^.{"+6+","+6+"}$")===null)) {
        var tips = Object.assign([], this.state.service_selected);
        tips[index].tips_amount = e.target.value;
        this.setState({service_selected: tips}, function(){
            //console.log(this.state.service_selected)
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
            tips_amount: Number(this.state.total_tips), 
            tips_percent:  Number(this.state.tips_percent),
            service_selected: this.state.service_selected
        }
        
        this.props.afterSubmitTips('Added Sucessfully',tips_input);
    }

    checkStatus(){
        return this.state.tips_type === 'manual' ? false : true;
    }

    render() {
        return (
            <Box style={{padding: 20}}>
                <Grid container spacing={0}>  
                   
                   {this.state.tips_type === 'equal' && <Grid container xs={12} style={{marginTop: 0, padding:'0 10px'}}>
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
                                                // inputComponent: NumberFormatCustom
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
                    {this.state.tips_type === 'percent' && <Grid container xs={12} style={{marginTop: 0, padding:'0 10px'}}>
                        <Grid item xs={6} style={{padding:'10px'}}>
                        <Typography variant="subtitle1" align="left"> 
                            Tip amount ($)
                        </Typography>
                        </Grid>
                        <Grid item xs={6} style={{padding:'10px'}}>
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

                    {this.state.service_selected.length>1 &&
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
                                        this.resetTips();
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
                    {this.state.service_selected.map((v,index)=>{
                        return (
                            <Grid container xs={12} >
                                    <Grid item xs={3} style={{padding:'10px', paddingLeft: 20}}>
                                    <Typography variant="subtitle1" align="left"> 
                                            {v.servicedetail.name}
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}>
                                    <Typography variant="subtitle1" align="left"> 
                                            {this.getEmployeeName(v.employee_id)} 
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}>
                                    <Typography variant="subtitle1" align="left"> 
                                        {v.perunit_cost}  
                                    </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{padding:'10px',paddingLeft: 20}}> 
                                        <TextField  
                                            required 
                                            type="number" 
                                            placeholder="Enter Amount" 
                                            value={this.state.service_selected[index].tips_amount}
                                            color="secondary"   
                                            variant="standard" 
                                            disabled={this.checkStatus()}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                // inputComponent: NumberFormatCustom
                                                
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
                                ${this.state.total_tips}
                            </Typography>
                            </Grid>
                        </Grid> }

                    <Grid item xs={12} style={{display:'flex', marginTop: 20, marginBottom: 20}}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4} style={{display:'flex'}}>
                            <Button style={{marginRight: 10}} color="secondary" onClick={()=>this.saveTips()} fullWidth variant="contained">Save</Button>
                            <Button color="secondary" fullWidth variant="outlined" onClick={() => this.handleCloseTips()} >Cancel</Button>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>


                </Grid>
            </Box>
        )
    }
}
export default Tips;
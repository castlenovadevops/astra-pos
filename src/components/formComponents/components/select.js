import React from "react";
import PropTypes from 'prop-types'; 
// material
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HTTPManager from '../../../utils/httpRequestManager';

export default class FSelect extends React.Component{
  httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state={
            options:[]
        }
        this.getLabel = this.getLabel.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    componentDidMount(){ 
        if(this.props.data instanceof Array){
            this.setState({options: this.props.data})
        }
        else if(this.props.data !== ''){ 

          this.httpManager.postRequest(this.props.data,{data:"SELECT COMPONENT"}).then(response=>{
            var options = []; 
            // console.log(response);
            response.data.forEach(el=>{ 
              options.push({
                label:this.getLabel(el),
                value:this.getValue(el)
              })
              this.setState({options: options})
            })
          }).catch(e=>{
            // console.log("ERROR::::", e)
          })
        }
    }

    getLabel(item){
      var labelkey = this.props.dataformat !== undefined ? this.props.dataformat.label : 'label';
      return item[labelkey];
    }

    getValue(item){  
        var valuekey = this.props.dataformat !== undefined ? this.props.dataformat.value : 'value';
        if(valuekey === 'all'){
          // console.log(item)
          return item;
        }
        return item[valuekey];
    }
    render() {
        return (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{this.props.label}</InputLabel> 
             <Select
              labelId="demo-simple-select-label"
              id={this.props.id}
              name={this.props.name}
              value={this.props.value ? this.props.value.toString() : ''}
              label={this.props.label}
              onChange={this.props.onChange}
              disabled={this.props.disabled}
              error={this.props.error}
              helperText={this.props.helperText}
              required={this.props.required}
              color={this.props.color} 
            >
              {this.state.options.map((v, i) => (
                <MenuItem value={v.value ? v.value.toString() : ''} key={i}>
                  {v.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    }
FSelect.propTypes = {
      label: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string,
      error: PropTypes.bool,
      helperText: PropTypes.string,
      value: PropTypes.string,
      required: PropTypes.bool,
      color: PropTypes.oneOf([
        'default',
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error'
      ]),
      optionlist: PropTypes.array,
      onChange: PropTypes.string,
      disabled: PropTypes.bool
    };
    
import React from "react";

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views'; 
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OpenTicketsComponent from "./opentickets";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }
  
export default class TicketListComponent extends React.Component{


    constructor(){
        super();
        this.state={
            userdetail:{}, 
            isLoading: false,
            value:0, 
            refreshData:false
        } 
        this.handleChangeIndex = this.handleChangeIndex.bind(this);
        this.handleChange = this.handleChange.bind(this) 
    } 


    static getDerivedStateFromProps(nextProps, prevState) {
      if(nextProps.refreshData !== prevState.refreshData){
          return {refreshData: nextProps.refreshData}
      }
    }


    handleChange(event, newValue){
        this.setState({value:newValue});
    };

    handleChangeIndex(index) {
        this.setState({value:index});
    };

    render(){
        return <Box>
        <Tabs
        value={this.state.value}
        onChange={this.handleChange}
        indicatorColor="primary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
        >
            <Tab label="Open Tickets" {...a11yProps(0)} />
            <Tab label="Closed Tickets" {...a11yProps(1)} /> 
        </Tabs>
        
        <SwipeableViews
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
        >
            <TabPanel value={this.state.value} index={0} dir={'ltr'}>
                <OpenTicketsComponent data={{
                  editTicket: this.props.data.editTicket
                }} refreshData={this.state.refreshData} onCompleteRefresh={this.props.onCompleteRefresh}/>
            </TabPanel>
            <TabPanel value={this.state.value} index={1} dir={'ltr'}>
           
            </TabPanel> 
        </SwipeableViews>
        </Box>
    }
}
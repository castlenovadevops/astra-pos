import React from "react";

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views'; 
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
        } 
        this.handleChangeIndex = this.handleChangeIndex.bind(this);
        this.handleChange = this.handleChange.bind(this) 
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
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
        
        <SwipeableViews
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
        >
            <TabPanel value={this.state.value} index={0} dir={'ltr'}>
            Item One
            </TabPanel>
            <TabPanel value={this.state.value} index={1} dir={'ltr'}>
            Item Two
            </TabPanel>
            <TabPanel value={this.state.value} index={2} dir={'ltr'}>
            Item Three
            </TabPanel>
        </SwipeableViews>
        </Box>
    }
}
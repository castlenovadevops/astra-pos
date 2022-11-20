import React from "react";

import CreateTicket from './create';

export default class TicketContainer extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            
        }
    }

    componentDidMount(){

    }

    render(){
        return <CreateTicket data={{
            ownerTechnician: this.props.ownerTechnician,
            closeCreateTicket: this.props.functions.closeCreateTicket,
            customer_detail:{}, 
        }}/>
    }
}
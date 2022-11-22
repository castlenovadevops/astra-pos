/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express');  

module.exports = class TicketController extends baseController{
    path = "/merchant/ticket";
    router = express.Router();
    msgController = new MsgController();
    routes =[];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/saveTicket",
                    type:"post",
                    method: "saveTicket",
                    authorization:'authorizationAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveTicket = async(req, res, next)=>{
        console.log(req.input);
        this.sendResponse({data: req.input}, res, 200)
    }

}
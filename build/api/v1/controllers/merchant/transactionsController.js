/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');

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
                    path:this.path+"/getTransactions",
                    type:"post",
                    method: "getTransactions",
                    authorization:'authorizationAuth'
                }, 
                
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  

    getTransactions = async(req, res)=>{
        var input = req.input

        let options = {
            where:{
                ticketId:{
                    [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where createdDate between Date('"+input.from_date+"') and Date('"+input.to_date+"') )")
                }
            },
            include:[
                {
                    model:this.models.tickets,
                    required: false
                }
            ]
        }

        this.readAll(options, 'ticketpayment').then(results=>{
            this.sendResponse({data: results}, res, 200)
        })

    }

}

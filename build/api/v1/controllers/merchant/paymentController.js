/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');
const { service } = require('restler');

module.exports = class TicketController extends baseController{
    path = "/merchant/payment";
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
                    path:this.path+"/getPayments",
                    type:"post",
                    method: "getPayments",
                    authorization:'authorizationAuth'
                }, 
                  
                {
                    path:this.path+"/savePayment",
                    type:"post",
                    method: "savePayment",
                    authorization:'authorizationAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


    getPayments = async(req,res)=>{
        try{
            var ticket = req.input.data
            let options = {
                where:{
                    ticketId: ticket.ticketId
                }
            }
            this.readOne({where:options.where, attributes:[
                [
                    Sequelize.literal("(select sum(ticketPayment) from ticketpayment where ticketId=`ticketpayment`.`ticketId`)"),
                    "Paidamount"
                ]
            ]},'ticketpayment').then(paidrec=>{ 
                console.log(paidrec)
                var paidamount = paidrec === null ? 0 : (paidrec.Paidamount || paidrec.dataValues.Paidamount)
                if(paidamount === undefined || paidamount === null){
                    paidamount = 0
                }
                var remainAmount = ticket.ticketTotalAmount - paidamount
                this.readAll(options, 'ticketpayment').then(payments=>{
                    this.sendResponse({data: payments, remainAmount:remainAmount}, res, 200);
                })
            })
        }
        catch(e){
            this.sendResponse({error:e, message:"Error occurred. Please try again"}, res, 400)
        }
    }

    savePayment = async(req, res)=>{
        try{
        var input = req.input 
         var ticket = input.ticketDetail;
         let options = {
             where:{
                 ticketId: ticket.ticketId
             }
         }
        let payinput = {
            "ticketId": input.ticketDetail.ticketId,
            "transactionId":Date.now().toString().split('.')[0]	,
            "customerPaid": input.customerPaid||'',
            "returnedAmount": input.returnedAmount||'',
            "ticketPayment": input.ticketpayment||'',
            "payMode":input.paymode,
            "cardType":input.cardtype,
            "paymentType":input.creditordebit,
            "paymentNotes":input.ticketpayment,
            "createdBy":req.userData.mEmployeeId,
            "createdDate":this.getDate()
        }
        this.create('ticketpayment', payinput).then(r=>{
            this.readOne({where:options.where, attributes:[
                [
                    Sequelize.literal("(select sum(ticketPayment) from ticketpayment where ticketId=`ticketpayment`.`ticketId`)"),
                    "Paidamount"
                ]
            ]},'ticketpayment').then(paidrec=>{  
                var paidamount = paidrec === null ? 0 : (paidrec.Paidamount || paidrec.dataValues.Paidamount)
                if(paidamount === undefined || paidamount === null){
                    paidamount = 0
                }
                var remainAmount = ticket.ticketTotalAmount - paidamount
                if(remainAmount <= 0){
                    this.update('tickets', {paymentStatus:'Paid'}, {where:{ticketId: ticket.ticketId}}).then(r=>{
                        this.sendResponse({message:"Paid successfully"}, res, 200);
                    })
                }
                else{ 
                    this.sendResponse({message:"Paid successfully"}, res, 200);
                }
            });
        })
    }
    catch(e){
        console.log(e)
    }
    }
}

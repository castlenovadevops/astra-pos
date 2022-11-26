/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize'); 

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
                {
                    path:this.path+"/updateTips",
                    type:"post",
                    method: "updateTips",
                    authorization:'authorizationAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


    getPayments = async(req,res)=>{
        try{
            var ticket = req.input.data
            console.log(ticket)
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

    updateTips = async(req, res, next)=>{
        var input = req.input;
        var ticketDetail = input.ticketDetail; 
        var ticketinput = {   
            "tipsAmount": ticketDetail.tipsAmount, 
            "ticketTotalAmount"	: ticketDetail.ticketTotalAmount, 
            "tipsType": ticketDetail.tipsType, 
        }
        this.update('tickets', ticketinput, {where:{ticketId: ticketDetail.ticketId}},true).then(re=>{ 
            this.saveTicketServices(req, res, next); 
        });

    }

    saveTicketServices = async(req, res, next, idx=0)=>{
        console.log(req.input.selectedServices.length)
        if(idx<req.input.selectedServices.length){
            var service = req.input.selectedServices[idx];  
            console.log(service.ticketServiceId, service)
            this.update('ticketTips',{status:0},{where:{ticketServiceId: service.ticketServiceId}}, true).then(r=>{
                // this.saveTicketServices(req, res, next, idx+1);
                if(Number(service.totalTips) > 0){
                    console.log(service.totalTips)
                    var tipinput = {
                        tipsCashPercentage: service.technician.mTipsCashPercentage,
                        tipsCheckPercentage: service.technician.mTipsCheckPercentage,
                        technicianId:service.technician.mEmployeeId,
                        tipsAmount: service.totalTips,
                        ticketServiceId: service.ticketServiceId,
                        createdBy: req.userData.mEmployeeId,
                        createdDate: this.getDate(),
                        status:1
                    }
                    console.log("TIPS INPUT::::::",tipinput)
                    this.create('ticketTips', tipinput).then(rr=>{ 
                        this.saveTicketServices(req, res, next, idx+1); 
                    })
                }
                else{ 
                    console.log("TIP INPUT::::::")
                    this.saveTicketServices(req, res, next, idx+1); 
                }
            })

        }
        else{
            this.sendResponse({message: "Ticket tips saved successfully."}, res, 200);
        }
    }
}

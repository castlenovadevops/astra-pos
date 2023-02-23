/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
// const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize

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
                {
                    path:this.path+"/payByLoyaltyPoints",
                    type:"post",
                    method: "payByLoyaltyPoints",
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
                    sequelize.literal("(select sum(ticketPayment) from ticketpayment where ticketId='"+ticket.ticketId+"')"),
                    "Paidamount"
                ]
            ]},'ticketpayment').then(paidrec=>{ 
                console.log(paidrec)
                var paidamount = paidrec === null ? 0 : (paidrec.Paidamount || paidrec.dataValues.Paidamount)
                if(paidamount === undefined || paidamount === null){
                    paidamount = 0
                } 
                var remainAmount = (Number(ticket.ticketTotalAmount) - Number(paidamount)).toFixed(2)
                if(Number(remainAmount) > 0){
                    console.log("REMAINING GREATER THAN 0")
                }
                console.log("Payments remain",ticket.ticketTotalAmount,  remainAmount, paidamount)
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
            "paymentNotes":input.paymentnotes,
            "createdBy":req.userData.mEmployeeId,
            "createdDate":this.getDate()
        }


        let detail = await this.readOne({where:{ticketId: input.ticketDetail.ticketId}}, 'tickets');
        var ticketDetail = detail.dataValues || detail;
        let loyaltypoints = await this.readOne({where:{status:1}}, 'LPRedeemSettings')


        if(ticketDetail.customerId !== undefined && ticketDetail.customerId !== null && ticketDetail.customerId !== ''){
            await this.update('mCustomers', {mCustomerId: ticketDetail.customerId, mCustomerStatus:1}, {where:{mCustomerId: ticketDetail.customerId}},true)
        }

        this.create('ticketpayment', payinput).then(async (r)=>{ 
            if(ticketDetail.ticketType === "GiftCard"){
                this.readOne({where:{cardNumber: ticketDetail.ticketCode}}, 'giftCards').then(g=>{
                    var gdetail = g.dataValues || g 
                    this.update("giftCards",{id:gdetail.id, status:'Active'}).then(r=>{

                    })
                })
            }
            console.log("SAVE PAYMENT POINTS CALLED", req.input)
            if( ticketDetail.customerId !== undefined &&  ticketDetail.customerId !== ''){
                
        console.log("SAVE PAYMENT POINTS CALLED", req.input)
        if(loyaltypoints!== null && loyaltypoints.id !== undefined){
                    if(Number(loyaltypoints.minimumTicketValue) <= Number(input.ticketpayment)){
                        var pointsinput =  {
                            customerId:  ticketDetail.customerId,
                            pointsCount: (Math.floor((Number(input.ticketpayment)/ Number(loyaltypoints.dollarSpent))) * Number(loyaltypoints.pointsCount)),
                            status:'Earned',
                            dollarValue:'',
                            createdBy: req.userData.mEmployeeId,
                            ticketValue: input.ticketpayment,
                            createdDate: this.getDate()
                        } 
                        console.log("POINTS INPUT", pointsinput);
                        await this.create(`customerLoyaltyPoints`, pointsinput)
                    }
                }
            }
            this.readOne({where:options.where, attributes:[
                [
                    sequelize.literal("(select sum(ticketPayment) from ticketpayment where ticketId='"+input.ticketDetail.ticketId+"')"),
                    "Paidamount"
                ]
            ]},'ticketpayment').then(paidrec=>{  
                var paidamount = paidrec === null ? 0 : (paidrec.Paidamount || paidrec.dataValues.Paidamount)
                if(paidamount === undefined || paidamount === null){
                    paidamount = 0
                }
                // var remainAmount = Number(ticket.ticketTotalAmount) - Number(paidamount)
                // console.log(remainAmount, paidamount)
 
                var remainAmount = (Number(ticket.ticketTotalAmount) - Number(paidamount)).toFixed(2)
                console.log("REMAINING AMOUNT FROM PAYMENT CONTROLLER")
                console.log(remainAmount, paidamount)
                if(Number(remainAmount) <= 0){ 
                    this.update('tickets', {paymentStatus:'Paid',ticketId: ticket.ticketId}, {where:{ticketId: ticket.ticketId}}).then(r=>{
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
            ticketId: ticketDetail.ticketId , 
            "tipsAmount": ticketDetail.tipsAmount, 
            "ticketTotalAmount"	: ticketDetail.ticketTotalAmount, 
            "tipsType": ticketDetail.tipsType, 
        }
        // console.log(input)
        console.log("^^^^^^^^^^^")
        console.log(input)
        if(input.selectedTransaction.transactionId !== undefined){
            var existdetail = await this.readOne({where:{ticketId: ticketDetail.ticketId}}, 'tickets')
            var tipamt = existdetail.tipsAmount || existdetail.dataValues.tipsAmount
            var payinput = {
                ticketPayment: Number(input.selectedTransaction.ticketPayment) - Number(tipamt) + Number(input.price.tipsAmount)  //Number(input.price.ticketSubTotal) + Number(input.price.tipsAmount)
            }
            console.log(tipamt,payinput )
            this.update('ticketpayment',payinput, {where:{id: input.selectedTransaction.id}} ).then(re=>{  
                this.update('tickets', ticketinput, {where:{ticketId: ticketDetail.ticketId}},true).then(re=>{ 
                    this.saveTicketServices(req, res, next); 
                });
            });
        }
        else{

            this.update('tickets', ticketinput, {where:{ticketId: ticketDetail.ticketId}},true).then(re=>{ 
                this.saveTicketServices(req, res, next); 
            });
        }

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
                        createdBy: "Adjusted",//req.userData.mEmployeeId,
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

    payByLoyaltyPoints = async(req, res, next)=>{
        var input = req.input;
        var ticket = input.ticketDetail; 
        let options = {
            where:{
                ticketId: ticket.ticketId
            }
        }
        let payinput = {
            "ticketId": input.ticketDetail.ticketId,
            "transactionId":Date.now().toString().split('.')[0]	,
            "customerPaid": '',
            "returnedAmount":  '',
            "ticketPayment": input.value,
            "payMode":'Loyalty Points',
            "cardType":'',
            "paymentType":'',
            "paymentNotes":'',
            "createdBy":req.userData.mEmployeeId,
            "createdDate":this.getDate()
        }
        this.create('ticketpayment', payinput).then(async (r)=>{
            var pointsinput =  {
                customerId:  input.customerId,
                pointsCount: input.points,
                status:'Redeemed',
                dollarValue:'',
                createdBy: req.userData.mEmployeeId,
                ticketValue: input.value,
                createdDate: this.getDate()
            } 
            console.log("POINTS INPUT", pointsinput);
            await this.create(`customerLoyaltyPoints`, pointsinput)
            this.readOne({where:options.where, attributes:[
                [
                    sequelize.literal("(select sum(ticketPayment) from ticketpayment where ticketId='"+input.ticketDetail.ticketId+"')"),
                    "Paidamount"
                ]
            ]},'ticketpayment').then(paidrec=>{  
                var paidamount = paidrec === null ? 0 : (paidrec.Paidamount || paidrec.dataValues.Paidamount)
                if(paidamount === undefined || paidamount === null){
                    paidamount = 0
                }
                var remainAmount = Number(ticket.ticketTotalAmount) - Number(paidamount)
                console.log(remainAmount, paidamount)
                if(remainAmount <= 0){
                    this.update('tickets', {paymentStatus:'Paid',ticketId: ticket.ticketId}, {where:{ticketId: ticket.ticketId}}).then(r=>{
                        this.sendResponse({message:"Paid successfully"}, res, 200);
                    })
                }
                else{ 
                    this.sendResponse({message:"Paid successfully"}, res, 200);
                }
            });
        });

    }
}

/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');

module.exports = class PayoutController extends baseController{
    path = "/merchant/payout";
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
                    path:this.path+"/getPayout",
                    type:"post",
                    method: "getPayout",
                    authorization:'authorizationAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


    getPayout = async (req, res)=>{
        let options = {
            where:{
                mEmployeeId:{
                    [Sequelize.Op.in]:Sequelize.literal("(select technicianId from ticketcommission where status=1)")
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`merchantEmployees`.`mEmployeeId`'),
                        "id"
                    ],
                    [
                        Sequelize.literal("(select sum(employeePercentage) from ticketcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'ServiceAmount'
                    ],
                    [
                        Sequelize.literal("(select sum(tipsAmount) from ticketTips where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'Tips'
                    ],
                    [
                        Sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'Discount'
                    ]
                ]
            }
        }
        this.readAll(options, 'merchantEmployees').then(results=>{
            this.sendResponse({data: results}, res, 200)
        })
    }
}
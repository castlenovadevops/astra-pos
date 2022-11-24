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
                        Sequelize.literal("(select sum(servicePrice) from ticketservices where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and serviceTechnicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
                        'TotalServiceAmount'
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
                    ],[
                        Sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mCommissionId"
                    ], 
                    [
                        Sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mOwnerPercentage"
                    ], 
                    [
                        Sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mEmployeePercentage"
                    ],
                    [
                        Sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mCashPercentage"
                    ],
                    [
                        Sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mCheckPercentage"
                    ],
                    [
                        Sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mTipsCashPercentage"
                    ],
                    [
                        Sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                        "mTipsCheckPercentage"
                    ]
                ]
            }
        }
        this.readAll(options, 'merchantEmployees').then(results=>{
            this.sendResponse({data: results}, res, 200)
        })
    }
}
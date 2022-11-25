/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize');

module.exports = class reportController extends baseController{
    path = "/merchant/report";
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
                    path:this.path+"/getReport",
                    type:"post",
                    method: "getReport",
                    authorization:'authorizationAuth'
                },  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


    getReport = async (req, res)=>{ 
        var owner = await this.readOne({where:{mEmployeeRoleName:'Owner'}}, 'merchantEmployees');
        

        var groupoptions = {
            group: [
                [Sequelize.literal('"created"'), 'ASC']
            ],
            // where:{

            // } 
            attributes:[
                // [ Sequelize.literal("select strftime('%m-%Y', createdDate) from tickets where ticketId=`tickets`.`ticketId`"),'created']
                [Sequelize.fn('sum', Sequelize.col('ticketTotalAmount')), 'tickettotal'],
                // [Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')), 'createdOn'],
                [Sequelize.fn('strftime','%m-%Y', Sequelize.col('createdDate')), 'created'],
            ]
        }

        const results = await this.readAll(groupoptions, 'tickets')
console.log("$$$%%$$$$$$$")
        console.log(results);

        this.sendResponse({owner: owner, results: results}, res, 200);

        // var query = `(select ticketId from tickets where strftime("%d-%m-%Y", createdDate) = strftime("%d-%m-%Y", Date.now()))`;
        // if(req.input.reportPeriod === 'monthly'){
        //     query = `(select ticketId from tickets where strftime("%m-%Y", createdDate) = strftime("%m-%Y", Date.now()))`;
        // }
        // if(req.input.reportPeriod === 'yearly'){
        //     query = `(select ticketId from tickets where strftime("%Y", createdDate) = strftime("%Y", Date.now()))`;
        // }
        // let ticketoptions = {
        //     where:{
        //         ticketId:{
        //             [Sequelize.Op.in]:Sequelize.literal(query)
        //         }
        //     }
        // }
        // const ticketres = await this.readAll(ticketoptions, 'tickets');
        // const ticketids = await ticketres.forEach(t=>t.ticketId)

        // let ticketserviceoptions = {
        //     where:{
        //         ticketId:{
        //             [Sequelize.Op.in]:Sequelize.literal(query)
        //         }
        //     }
        // }
        // console.log("############")
        // console.log(req.input)

        // // const ticketserviceres = await this.readAll(ticketserviceoptions, 'ticketservices');
        // // const ticketserviceids = await ticketres.forEach(t=>t.ticketServiceId);
        // var options = {
        //     where:{
        //         mEmployeeRoleName:'Owner'
        //     },
        //     attributes:{
        //         include:[ 
        //         [
        //             Sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from ticketservices where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and serviceTechnicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //             'TotalServiceAmount'
        //         ],
        //         [
        //             Sequelize.literal("(select sum(employeePercentage) from ticketcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //             'ServiceAmount'
        //         ],
        //         [
        //             Sequelize.literal("(select sum(tipsAmount) from ticketTips where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //             'Tips'
        //         ],
        //         [
        //             Sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //             'Discount'
        //         ],[
        //             Sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mCommissionId"
        //         ], 
        //         [
        //             Sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mOwnerPercentage"
        //         ], 
        //         [
        //             Sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mEmployeePercentage"
        //         ],
        //         [
        //             Sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mCashPercentage"
        //         ],
        //         [
        //             Sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mCheckPercentage"
        //         ],
        //         [
        //             Sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mTipsCashPercentage"
        //         ],
        //         [
        //             Sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //             "mTipsCheckPercentage"
        //         ]
        //         ]
        //     }
        // }

        // if(req.input.type !== 'Owner'){ 
        //     options = { 
        //         attributes:{
        //             include:[ 
        //             [
        //                 Sequelize.literal("(select sum(servicePerUnitCost*serviceQty) from ticketservices where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and serviceTechnicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //                 'TotalServiceAmount'
        //             ],
        //             [
        //                 Sequelize.literal("(select sum(employeePercentage) from ticketcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //                 'ServiceAmount'
        //             ],
        //             [
        //                 Sequelize.literal("(select sum(tipsAmount) from ticketTips where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //                 'Tips'
        //             ],
        //             [
        //                 Sequelize.literal("(select sum(employeePercentage) from ticketservicediscountcommission where ticketServiceId in (select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"'))) and technicianId=`merchantEmployees`.`mEmployeeId`  and status=1)"),
        //                 'Discount'
        //             ],[
        //                 Sequelize.literal("(select id from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mCommissionId"
        //             ], 
        //             [
        //                 Sequelize.literal("(select mOwnerPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mOwnerPercentage"
        //             ], 
        //             [
        //                 Sequelize.literal("(select mEmployeePercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mEmployeePercentage"
        //             ],
        //             [
        //                 Sequelize.literal("(select mCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mCashPercentage"
        //             ],
        //             [
        //                 Sequelize.literal("(select mCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mCheckPercentage"
        //             ],
        //             [
        //                 Sequelize.literal("(select mTipsCashPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mTipsCashPercentage"
        //             ],
        //             [
        //                 Sequelize.literal("(select mTipsCheckPercentage from mEmployeeCommission where merchantId='"+req.deviceDetails.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
        //                 "mTipsCheckPercentage"
        //             ]
        //             ]
        //         }
        //     }
        // }


        // // var servicetaxes = await this.readAll({where:{
        // //     ticketServiceId:{
        // //         [Sequelize.Op.in]:Sequelize.literal("( select ticketServiceId from ticketservices where ticketId in (select ticketId from ticketpayment where ticketId in (select ticketId from tickets where paymentStatus='Paid' ) and Date(createdDate) between Date('"+req.input.from_date.replace("T"," ").replace("Z","")+"') and  Date('"+req.input.to_date.replace("T"," ").replace("Z","")+"')))")
        // //     }
        // // },
        // // attributes: [
        // //         [
        // //             Sequelize.literal
        // //         ]
        // //     ]}, 'ticketservicetax')

        // this.readAll(options, 'merchantEmployees').then(resp=>{
        //     this.sendResponse({data: resp}, res, 200)
        // })
    }
}
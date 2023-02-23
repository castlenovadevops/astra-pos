/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
const { Sequelize } = require('sequelize');
const sequelize =  require('../../models').sequelize
var cron = require('node-cron');

module.exports = class BatchController extends baseController{
    path = "/merchant/batch"; 
    task;

    msgController = new MsgController(); 
    routes = [];

    isRunningBatch = false;

    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveBatch",
                    authorization:"authorizationAuth"
                }, 
                // {
                //     path:this.path+"/startCronBatch",
                //     type:"post",
                //     method:"startCronBatch",
                //     authorization:"accessAuth"
                // },
                {
                    path:this.path+"/autobatch",
                    type:"post",
                    method: "autoBatch",
                    authorization:"authorizationAuth"
                }, 
                {
                    path:this.path+"/autobatchprevday",
                    type:"post",
                    method: "autoBatchPrevDay",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/getBatches",
                    type:"post",
                    method: "getBatches",
                    authorization:"authorizationAuth"
                }, 
                {
                    path:this.path+"/getBatchTickets",
                    type:"post",
                    method: "getBatchTickets",
                    authorization:"authorizationAuth"
                }, 
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    // startCronBatch = async(req,res,next)=>{ 
    //     this.task = cron.schedule('* * * * *', () =>  {
    //         console.log('Started task');
    //       }); 
    // }
    

    saveBatch = async(req, res, next)=>{ 
        let batches = await this.readAll({},'batches')
        var batchname = "Batch "+(batches.length+1)
        var fromdate = req.input.from_date || this.getDate()
        var todate = req.input.to_date || this.getDate()
        var input  = {
            batchName: batchname,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
            merchantId: req.deviceDetails.merchantId,
            batchMode: 'manual',
            "POSId": req.deviceDetails.device.POSId
        }
// console.log(req.deviceDetails);
        var tickets = await this.readAll({where:{ticketId:{
            [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and payMode='card' and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+todate.substring(0, 10)+" 23:59:59')")
        }}}, 'tickets')
        console.log(tickets)
        console.log("TICKET LENGTH BATCH Manual", tickets.length)
        if(tickets.length > 0){ 
            this.create('batches', input).then(r=>{
                var batchID  = r.dataValues !== undefined ? r.dataValues.batchId : r.batchId
                // this.update(`tickets`,{batchId: batchID},{where:{ticketId:{
                //     [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and payMode='card' and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+todate.substring(0, 10)+" 23:59:59')")
                // }}})
                tickets.forEach((element, i) => {
                    this.update(`tickets`,{batchId: batchID, ticketId: element.ticketId},{where:{ticketId:element.ticketId}}).then(r=>{

                    })
                    if(i === tickets.length-1){
                        setTimeout(() => { 
                            this.isRunningBatch= false;
                            this.sendResponse({data: input}, res, 200)
                        }, 1000);
                    }
                });
                // this.sendResponse({data: input}, res, 200)
            }).catch(e=>{
                this.sendResponse({message:"Error occurred. Please try again later"}, res, 400)
            })
        }
        else{
            this.sendResponse({data: input}, res, 200)
        }
    }

    autoBatchPrevDay = async(req, res, next)=>{ 
        let batches = await this.readAll({},'batches')
        var batchname = "Batch "+(batches.length+1)
        var fromdate = req.input.fromdate 
        // var todate = req.input.to_date || this.getDate()
        var input  = {
            batchName: batchname,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
            merchantId: req.deviceDetails.merchantId,
            "POSId": req.deviceDetails.device.POSId,
            batchMode:'auto'
        }
        var tickets = await this.readAll({where:{ticketId:{
            [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and payMode='card' and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+fromdate.substring(0, 10)+" 23:59:59')")
        }}}, 'tickets')
        console.log(tickets)
        console.log("TICKET LENGTH BATCH AUTO PREVDAY", tickets.length)
        if(tickets.length > 0){
            this.create('batches', input).then(r=>{
                var batchID  = r.dataValues !== undefined ? r.dataValues.batchId : r.batchId
                tickets.forEach((element, i) => {
                    this.update(`tickets`,{batchId: batchID, ticketId: element.ticketId},{where:{ticketId:element.ticketId}}).then(r=>{

                    })
                    if(i === tickets.length-1){
                        setTimeout(() => { 
                            this.isRunningBatch= false;
                            this.sendResponse({data: input}, res, 200)
                        }, 1000);
                    }
                });
                // this.update(`tickets`,{batchId: batchID},{where:{ticketId:{
                //     [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and payMode='card' and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+fromdate.substring(0, 10)+" 23:59:59')")
                // }}}).then(r=>{
                //     this.sendResponse({data: input}, res, 200)
                // })
            }).catch(e=>{
                this.sendResponse({message:"Error occurred. Please try again later"}, res, 400)
            })
        }
        else{
            this.sendResponse({data: "Batch not created"}, res, 200)
        }
    }

    autoBatch = async(req, res, next)=>{ 
        if(!this.isRunningBatch){
            console.log("RUNNING BATCH")
            let batches = await this.readAll({},'batches')
            var batchname = "Batch "+(batches.length+1)
            var fromdate =  this.getDate()
            this.isRunningBatch = true
            // var todate = req.input.to_date || this.getDate()
            var input  = {
                batchName: batchname,
                createdBy: req.userData.mEmployeeId,
                createdDate: this.getDate(),
                merchantId: req.deviceDetails.merchantId,
                "POSId": req.deviceDetails.device.POSId,
                batchMode:'auto'
            }
            var tickets = await this.readAll({where:{ticketId:{
                [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and payMode='card' and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+fromdate.substring(0, 10)+" 23:59:59')")
            }}}, 'tickets')
            console.log(tickets)
            console.log("TICKET LENGTH BATCH AUTO", tickets.length, this.getDate())
            if(tickets.length > 0){ 
                this.create('batches', input).then(r=>{
                    var batchID  = r.dataValues !== undefined ? r.dataValues.batchId : r.batchId
                    tickets.forEach((element, i) => {
                        this.update(`tickets`,{batchId: batchID, ticketId: element.ticketId},{where:{ticketId:element.ticketId}}).then(r=>{

                        })
                        if(i === tickets.length-1){
                            setTimeout(() => { 
                                this.isRunningBatch= false;
                                this.sendResponse({data: input}, res, 200)
                            }, 1000);
                        }
                    });
                    // this.update(`tickets`,{batchId: batchID},{where:{ticketId:{
                    //     [Sequelize.Op.in]: sequelize.literal("(select ticketId from ticketpayment where (batchId is null or batchId='') and payMode='card'  and createdDate between '"+fromdate.substring(0, 10)+" 00:00:00' and '"+fromdate.substring(0, 10)+" 23:59:59')")
                    // }}}, false).then(r=>{
                    //     this.isRunningBatch= false;
                    //     this.sendResponse({data: input}, res, 200)
                    // }).catch(e=>{
                    //     this.isRunningBatch= false;
                    //     this.sendResponse({message:"Error occurred. Please try again later"}, res, 400)
                    // });
                }).catch(e=>{
                    this.isRunningBatch= false;
                    this.sendResponse({message:"Error occurred. Please try again later"}, res, 400)
                })
            }
            else{
                this.isRunningBatch= false;
                this.sendResponse({data: input}, res, 200)
            }
        }
        else{
            this.isRunningBatch= false;
            this.sendResponse({data: input}, res, 200)
        }
    }

    getBatches= async(req, res, next)=>{
        var fromdate = req.input.from_date || this.getDate()
        var todate = req.input.to_date || this.getDate()
        var options = {
            where:{
                createdDate:{  
                    [Sequelize.Op.between]:[fromdate.substring(0, 10)+" 00:00:00", todate.substring(0, 10)+" 23:59:59" ]
                }
            },
            attributes:{
                include:[
                    [
                        sequelize.literal("(select count(ticketId) from tickets where batchId=`batches`.`batchId`)"),
                        'ticketCount'
                    ]
                ]
            }
        }
        this.readAll(options, 'batches').then(r=>{
            this.sendResponse({data:r}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occured"}, res, 400)
        })
    }

    getBatchTickets= async(req, res, next)=>{
        var options = {
            where:{
                ticketId:{
                    [Sequelize.Op.in]:sequelize.literal("(select ticketId from tickets where batchId='"+ req.input.batchId+"')")
                }
            },
            attributes:{
                include:[
                    [
                        Sequelize.literal("(select ticketCode from tickets where ticketId=`ticketpayment`.`ticketId`)"),
                        'ticketCode'
                    ]
                ]
            }
        }

        this.readAll(options, 'ticketpayment').then(r=>{
            this.sendResponse({data:r}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occured"}, res, 400)
        })
    }
}
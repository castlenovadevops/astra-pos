/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 

const { Sequelize } = require('sequelize');
const settings = require('../../config/settings');
let sequelize = settings.database; 
const db = settings.database;

const pkfields = { 
    "tickets":"id"
}

module.exports = class SyncTicketController extends baseController{
    path = "/pos/syncData";
    router = express.Router();
    routes = [];
    apiManager = new APIManager();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/tickets",
                    type:"post",
                    method: "syncTickets",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncTickets = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'tickets'}}, 'toBeSynced')
        console.log("SYNC CATEGORY::::: ", toBeSynced.length)
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync Ticket CALLED")

            let tobesync = toBeSynced[idx];
            let datares = await this.readOne({
                    where:{
                        ticketId: tobesync.tableRowId
                    }, 
                    include:[ 
                        {
                            model: this.models.ticketdiscount,
                            required: false,
                            where:{
                                status:1
                            }
                        }, 
                        {
                            model: this.models.ticketdiscountcommission,
                            required: false,
                            where:{
                                status:1
                            }
                        }, 
                        {
                            model: this.models.ticketpayment,
                            required: false, 
                        },  
                        {
                            model: this.models.ticketservices,
                            required: false, 
                            where:{ 
                                status:1
                            },
                            include:[
                                {
                                    model: this.models.mProducts,
                                    required: false, 
                                }, 
                                {
                                    model: this.models.ticketservicetax,
                                    required: false,
                                    where:{
                                        status:1
                                    }
                                },
                                {
                                    model: this.models.ticketservicediscount,
                                    required: false,
                                    where:{
                                        status:1
                                    },
                                    include:[
                                        {
                                            model:this.models.mDiscounts,
                                            required: false
                                        }
                                    ]
                                },
                                {
                                    model: this.models.ticketservicediscountcommission,
                                    required: false,
                                    where:{
                                        status:1
                                    }
                                }, 
                                {
                                    model: this.models.ticketTips,
                                    required: false,
                                    where:{
                                        status:1
                                    }
                                }, 
                                {
                                    model: this.models.ticketcommission,
                                    required: false,
                                    where:{
                                        status:1
                                    }
                                }
                            ]
                        }, 
                    ],
                }, 'tickets')
            var data = datares.dataValues
            data["createdDate"] = data["createdDate"] ? data["createdDate"].replace("T"," ").replace("Z","") : '';
            data["updatedDate"] = data["updatedDate"] ? data["updatedDate"].replace("T"," ").replace("Z","") : '';
            data["addedOn"] = req.deviceDetails.device.POSId || 'POS';
            console.log(data)
            this.apiManager.postRequest('/pos/sync/saveTicket', data , req).then(response=>{
                console.log(response)
                this.delete('toBeSynced', {tableRowId: toBeSynced[idx].tableRowId, syncTable: toBeSynced[idx].syncTable}).then(r=>{    
                    this.syncData(idx+1, toBeSynced, req, res, next);
                })
            }) 
        }
        else{
            this.pullData(req,res, next);
        }
    } 

    pullData = async(req,res,next)=>{
        var input = {
            POSId: req.deviceDetails.device.POSId || '',
            merchantId: req.deviceDetails.merchantId
        }

        this.apiManager.postRequest(`/pos/sync/getTickets`, input, req).then(r=>{
            
            if(r.data !== undefined ){
                if(r.data.length > 0){
                    this.saveTicket(0, r.data, req, res, next)
                }
                else{
                    this.sendResponse({message:"Ticket Module synced successfully"}, res, 200);
                }
            }
            else{
                this.sendResponse({message:"Ticket Module synced successfully"}, res, 200);
            }
        }) 
    }



    saveTicket  = async(i, tickets, req, res, next)=>{
        let ticketinput = tickets[i];   
        this.delete('tickets',{ 
            ticketId: ticketinput.ticketId
            }).then(r=>{
                console.log("Save ticket called1")
            this.delete('ticketdiscount',{ 
                ticketId: ticketinput.ticketId
            }).then(r=>{
                console.log("Save ticket called 2")
                this.delete('ticketdiscountcommission',{ 
                    ticketId: ticketinput.ticketId
                }).then(r=>{
                    console.log("Save ticket called 3")
                    this.delete('ticketpayment',{ 
                        ticketId: ticketinput.ticketId
                    }).then(r=>{
                        console.log("Save ticket called 4")
                        this.delete('ticketTips',{ 
                            ticketServiceId:{
                                [Sequelize.Op.in]: Sequelize.literal("(select ticketServiceId from ticketservices where ticketId='"+ticketinput.ticketId+"')")
                            } 
                        }).then(r=>{
                            console.log("Save ticket called 5")
                            console.log("Save ticket called 6")
                            this.delete('ticketservicetax',{ 
                                ticketServiceId:{
                                    [Sequelize.Op.in]: Sequelize.literal("(select ticketServiceId from ticketservices where ticketId='"+ticketinput.ticketId+"')")
                                } 
                            }).then(r=>{
                                console.log("Save ticket called 7")
                                this.delete('ticketservicediscount',{ 
                                    ticketServiceId:{
                                        [Sequelize.Op.in]: Sequelize.literal("(select ticketServiceId from ticketservices where ticketId='"+ticketinput.ticketId+"')")
                                    } 
                                }).then(r=>{
                                    console.log("Save ticket called 8")
                                    this.delete('ticketservicediscountcommission',{ 
                                        ticketServiceId:{
                                            [Sequelize.Op.in]: Sequelize.literal("(select ticketServiceId from ticketservices where ticketId='"+ticketinput.ticketId+"')")
                                        } 
                                    }).then(r=>{
                                        console.log("Save ticket called 9")
                                        this.delete('ticketcommission',{
                                            ticketServiceId:{
                                                [Sequelize.Op.in]: Sequelize.literal("(select ticketServiceId from ticketservices where ticketId='"+ticketinput.ticketId+"')")
                                            } 
                                        }).then(r=>{
                                            this.delete('ticketservices',{ 
                                                ticketId: ticketinput.ticketId
                                            }).then(r=>{
                                                this.saveTicketDiscounts(0,i, tickets, req, res, next)
                                            }) 
                                        })
                                    })
                                })
                            })
                        });
                    })
                })
            })
        });
    }

    saveTicketDiscounts = async(j, i,tickets, req, res, next)=>{
        console.log("Save ticket discounts called")
        var ticketinput = tickets[i];
        if(j < ticketinput.ticketdiscounts.length){
            var input = ticketinput.ticketdiscounts[j]
            this.create('ticketdiscount', input).then(r=>{
                this.saveTicketDiscounts(j+1,i, tickets, req, res, next);
            })
        }
        else{
            this.saveTicketDiscountCommission(0, req, res, next)
        }
    }


    saveTicketDiscountCommission = async(i, req, res, next)=>{
        console.log("Save ticket discountcommission called")
        if(i < req.input.ticketdiscountcommissions.length){
            var input = req.input.ticketdiscountcommissions[i]
            this.create('ticketdiscountcommission', input).then(r=>{
                this.saveTicketDiscountCommission(i+1, req, res, next);
            })
        }
        else{
            this.saveTicketPayments(0, req, res, next)
        }
    }  

    saveTicketPayments = async(i, req, res, next)=>{
        console.log("Save ticket payments called")
        if(i < req.input.ticketpayments.length){
            var input = req.input.ticketpayments[i]
            this.create('ticketpayment', input).then(r=>{
                this.saveTicketPayments(i+1, req, res, next);
            })
        }
        else{
            this.saveTicketServices(0, req, res, next)
        }
    }

    saveTicketServices = async(i, req, res, next)=>{
        console.log("Save ticket services called")
        if(i < req.input.ticketservices.length){
            var input = req.input.ticketservices[i]
            this.create('ticketservices', input).then(r=>{ 
                this.saveTicketCommissions(0, i,req, res, next)
            })
        }
        else{
           this.sendResponse({message:"Ticket synced successfully."}, res, 200)
        }
    } 


    saveTicketCommissions = async(j, i, req, res, next)=>{
        console.log("Save ticket commission called")
        var service = req.input.ticketservices[i]
        if(j < service.ticketcommissions.length){
            var input = service.ticketcommissions[j]
            console.log(input)
            this.create('ticketcommission', input).then(r=>{
                this.saveTicketCommissions(j+1, i, req, res, next);
            })
        }
        else{
            this.saveServiceTaxes(0, i, req, res, next)
        }
    }
    
    saveServiceTaxes = async(j, i, req, res, next)=>{
        console.log("Save ticket service taxes called")
        var services = req.input.ticketservices[i]
        if(j < services.ticketservicetaxes.length){
            var input = services.ticketservicetaxes[j]
            this.create('ticketservicetax', input).then(r=>{
                this.saveServiceTaxes(j+1, i, req, res, next);
            })
        }
        else{
            this.saveServiceDiscounts(0, i, req, res, next)
        }
    } 

    
    saveServiceDiscounts = async(j, i, req, res, next)=>{
        console.log("Save ticket service discount called")
        var services = req.input.ticketservices[i]
        if(j < services.ticketservicediscounts.length){
            var input = services.ticketservicediscounts[j]
            this.create('ticketservicediscount', input).then(r=>{
                this.saveServiceDiscounts(j+1, i, req, res, next);
            })
        }
        else{
            this.saveServiceDiscountCommissions(0, i, req, res, next)
        }
    } 


    
    saveServiceDiscountCommissions = async(j, i, req, res, next)=>{
        console.log("Save ticket service discount commission called")
        var services = req.input.ticketservices[i]
        if(j < services.ticketservicediscountcommissions.length){
            var input = services.ticketservicediscountcommissions[j]
            this.create('ticketservicediscountcommission', input).then(r=>{
                this.saveServiceDiscountCommissions(j+1, i, req, res, next);
            })
        }
        else{
            this.saveServiceTips(0, i, req, res, next)
        }
    } 
    
    saveServiceTips = async(j, i, req, res, next)=>{
        console.log("Save ticket service tips called")
        var services = req.input.ticketservices[i]
        if(j < services.ticketTips.length){
            var input = services.ticketTips[j]
            this.create('ticketTips', input).then(r=>{
                this.saveServiceTips(j+1, i, req, res, next);
            })
        }
        else{
            this.saveTicketServices(i+1, req, res, next);
        }
    }  

}
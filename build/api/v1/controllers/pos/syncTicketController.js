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
    'mTax':"id",
    'mCategory':"id"
}

module.exports = class SyncCategoryController extends baseController{
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
                this.delete('toBeSynced', {tableRowId: toBeSynced[idx].tableRowId, syncTable: toBeSynced[idx].syncTable}).then(r=>{    
                    this.syncData(idx+1, toBeSynced, req, res, next);
                })
            }) 
        }
        else{
            this.sendResponse({message:"Ticket Module synced successfully"}, res, 200);
        }
    } 
}
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
const Sequelize = require('sequelize')
const settings = require('../../config/settings');
let sequelize = settings.database; 
const db = settings.database;

const pkfields = {
    'mTax':"id",
    'appointments':"id"
}

module.exports = class SyncAppointmentController extends baseController{
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
                    path:this.path+"/appointments",
                    type:"post",
                    method: "syncAppointments",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncAppointments = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'appointments'}}, 'toBeSynced')
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.deleteAll('appointments').then(r=>{
                this.deleteAll('appointmentServices').then(r=>{
                    this.pullData(req, res, next)
                })
            })
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync Appointment CALLED", toBeSynced.length)
            let detail = await this.readOne({ 
                where:{
                    id: toBeSynced[idx].tableRowId ,  
                },
                include:[
                    {
                        model:this.models.appointmentServices,  
                        required: false
                    }, 
                ]
                
            }, 'appointments')
            if(detail !== null){
                var appt = detail || detail.dataValues; 
                console.log(appt)
                appt["createdDate"] = appt["createdDate"].replace("T"," ").replace("Z","");  
                this.apiManager.postRequest('/pos/sync/saveAppointment',  appt, req).then(response=>{
                    this.delete('toBeSynced', {tableRowId: toBeSynced[idx].tableRowId, syncTable: toBeSynced[idx].syncTable}).then(r=>{    
                        this.syncData(idx+1, toBeSynced, req, res, next);
                    })
                })

            }
            else{
                this.syncData(idx+1, toBeSynced, req, res, next); 
            }
        }
        else{
            this.deleteAll('appointments').then(r=>{
                this.deleteAll('appointmentServices').then(r=>{
                    this.pullData(req, res, next)
                })
            })
        }
    }

    pullData = async(req, res, next)=>{ 
        
        var input = { 
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            syncAll: true
        }
        this.apiManager.postRequest('/pos/sync/getAppointments',  input ,req).then(resp=>{ 
            console.log("Appointments ", resp.response.data.length)
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"Appointments Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,data, req, res, next, syncedRows)=>{
        var model = "appointments"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{appointmentId: data[idx].appointmentId}}, 'appointments')
            if(detailexist !== null){
                this.delete('appointments', {appointmentId:  data[idx].appointmentId}).then(r=>{
                    this.create('appointments', data[idx], false).then(async r=>{
                        this.delete('appointmentServices',{appointmentId:detail.appointmentId}).then(r=>{ 
                            this.saveServices(0, idx, data, model, syncedRows,  req, res, next) 
                        })
                    })
                })
            }
            else{
                this.create('appointments', data[idx], false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield]) 
                        this.saveServices(0, idx, data, model, syncedRows,  req, res, next)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'appointments'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                    this.sendResponse({message:"Appointment Module synced successfully"}, res, 200); 
            }) 
        }
    }

    saveServices = async (catidx, idx, data, model, syncedRows,  req, res, next)=>{
        var detail = data[idx]
        if(catidx < detail.appointmentServices.length){
            var catdetail = detail.appointmentServices[catidx];
            this.create('appointmentServices', catdetail, false).then(r=>{
                this.saveServices(catidx+1, idx, data, model, syncedRows, req, res, next);
            })
        }
        else{
            this.completeSync(idx, data, model, syncedRows, req, res, next);
        }
    } 

    completeSync = async( idx, data, model, syncedRows, req, res, next)=>{
        var detail = data[idx]
        var pkfield = pkfields[model]
        syncedRows.push(detail[pkfield])
        this.saveData(idx+1, data, req, res, next,syncedRows)
    }
}
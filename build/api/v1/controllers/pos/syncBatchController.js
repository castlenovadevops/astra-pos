/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
 

const pkfields = { 
    'batches':"batchId"
}

module.exports = class SyncBatchController extends baseController{
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
                    path:this.path+"/batches",
                    type:"post",
                    method: "syncBatches",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncBatches = async(req, res, next)=>{
        let toBeSynced = await this.readAll({where:{syncTable:'batches'}}, 'toBeSynced')
        console.log("SYNC batches::::: ", toBeSynced.length)
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{ 
            this.deleteAll('batches').then(r=>{
                this.pullData(req, res, next)
            })
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            console.log("SAVE sync batches CALLED")

            let tobesync = toBeSynced[idx];
            let datares = await this.readOne({where:{
                batchId: tobesync.tableRowId
            }}, 'batches')
            if(datares !== null){
                var data = datares.dataValues
                data["createdDate"] = data["createdDate"].replace("T"," ").replace("Z","");  
                console.log(data)
                this.apiManager.postRequest('/pos/sync/savebatches', data , req).then(response=>{
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
            this.deleteAll('batches').then(r=>{
                this.pullData(req, res, next)
            })
        }
    }

    pullData = async(req, res, next)=>{ 
        
        var input = { 
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            syncAll: true
        }
        this.apiManager.postRequest('/pos/sync/getBatchesData',  input ,req).then(resp=>{ 
            console.log("batches LENGTH", resp)
            if(resp.response.data.length > 0){
                this.saveData(0, resp.response.data, req, res, next, [])
            }
            else{
                this.sendResponse({message:"batches Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,data, req, res, next, syncedRows)=>{
        var model = "batches"
        if(idx<data.length){ 
            var detail = data[idx];
            let detailexist = await this.readOne({where:{batchId: data[idx].batchId }}, 'batches')
            if(detailexist !== null){
                this.delete('batches', {batchId:  data[idx].batchId}).then(r=>{
                    var batch = data[idx];
                    batch["createdDate"] = data[idx]["createdDate"].replace("T"," ").replace("Z",""); 
                    console.log("BATCH CREATED", batch["createdDate"])
                    this.create('batches', batch, false).then(async r=>{
                        var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, data, req, res, next,syncedRows)
                    })
                })
            }
            else{
                var batch = data[idx];
                batch["createdDate"] = data[idx]["createdDate"].replace("T"," ").replace("Z","");  
                console.log("BATCH CREATED", batch["createdDate"])
                this.create('batches', batch , false).then(async r=>{ 
                    var pkfield = pkfields[model]
                        syncedRows.push(detail[pkfield])
                        this.saveData(idx+1, data, req, res, next,syncedRows)
                })
            }
        }
        else{
            var input = { 
                merchantId: req.deviceDetails.merchantId,
                POSId: req.deviceDetails.device.POSId,
                tableRows: syncedRows,
                syncedTable:'batches'
            }
            this.apiManager.postRequest('/pos/updateSync',  input ,req).then(resp=>{  
                // console.log("SYNC UPDATES CALLED")
                    this.sendResponse({message:"batches Module synced successfully"}, res, 200); 
            }) 
        }
    }
}
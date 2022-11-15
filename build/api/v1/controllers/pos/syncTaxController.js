/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 

const settings = require('../../config/settings');
let sequelize = settings.database;

module.exports = class RegistrationController extends baseController{
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
                    path:this.path+"/tax",
                    type:"post",
                    method: "syncTax",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    syncTax = async(req, res, next)=>{
        let toBeSynced = this.readAll({where:{syncTable:'mTax'}}, 'toBeSynced')
        if(toBeSynced.length > 0){  
            this.syncData(0, toBeSynced, req, res, next);
        }
        else{
            this.pullData(req, res, next)
        }
    }

    syncData = async(idx, toBeSynced, req, res, next)=>{
        if(idx < toBeSynced.length ){ 
            this.apiManager.postRequest('/pos/sync/saveTax', toBeSynced[idx] , req).then(response=>{
                this.delete('toBeSynced', {tableRowId: toBeSynced[idx].tableRowId, syncTable: toBeSynced[idx].syncTable}).then(r=>{    
                    this.syncData(idx+1, toBeSynced, req, res, next);
                })
            })
        }
        else{
            this.pullData(req, res, next)
        }
    }

    pullData = async(req, res, next)=>{ 
        this.apiManager.getRequest('/pos/sync/getTax', req).then(response=>{
            if(response.length > 0){
                this.saveData(0, response, req, res, next)
            }
            else{
                this.sendResponse({message:"Tax Module synced successfully"}, res, 200);
            }
        })
    }

    saveData = async(idx,taxes, req, res, next)=>{
        let taxexist = await this.readOne({where:{mTaxId: taxes[idx].mTaxId, mTaxStatus:1}})
        if(taxexist !== null){
            
        }
        else{

        }
    }
}
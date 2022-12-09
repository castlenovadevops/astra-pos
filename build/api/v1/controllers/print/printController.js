/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
 

module.exports = class SyncTaxController extends baseController{
    path = "/pos/print";
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
                    path:this.path+"/getPrinters",
                    type:"post",
                    method: "getPrinters",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/savePrinter",
                    type:"post",
                    method: "savePrinter",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 


    getPrinters = async(req, res, next)=>{
        
    }

    savePrinter = async(req, res, next)=>{
        
    }
}
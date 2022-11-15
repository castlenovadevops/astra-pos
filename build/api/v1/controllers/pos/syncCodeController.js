/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
module.exports = class RegistrationController extends baseController{
    path = "/pos";
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
                    path:this.path+"/checkSyncCode",
                    type:"post",
                    method: "checkSyncCode",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    
    checkSyncCode = async(req, res, next)=>{console.log("INPUT")
    // console.log(req.input)
        this.apiManager.postRequest('/pos/checkSyncCode', req.body, req).then(response=>{
            console.log(response)
            this.sendResponse(response.response, res, response.status);
        })
    }
}
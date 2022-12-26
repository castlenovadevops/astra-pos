/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
const macaddress = require('macaddress')
const os = require('os')
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
                },
                {
                    path:this.path+"/swapdevice",
                    type:"post",
                    method: "swapdevice",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    swapdevice = async(req, res, next)=>{
        var input = {
            fromDevice: req.input.fromDevice, 
            toDevice: req.input.toDevice, 
        }
        this.apiManager.postRequest('/pos/swapdevice', input, req).then(response=>{
            // console.log(response)
            this.sendResponse(response.response, res, response.status);
        })
    }

    
    checkSyncCode = async(req, res, next)=>{// console.log("INPUT")
    // // console.log(req.input)
        const computerName = os.hostname() 
        // console.log(computerName);
        var thisobj = this;
        macaddress.all().then(function (all) {  
            var input = {
                syncCode: req.input.syncCode,
                deviceName: computerName,
                deviceMAC: JSON.stringify(all, null, 2),
                deviceDetails: JSON.stringify(req.input.deviceDetails)
            }
            thisobj.apiManager.postRequest('/pos/checkSyncCode', input, req).then(response=>{
                // console.log(response)
                thisobj.sendResponse(response.response, res, response.status);
            })

        });
    }
}
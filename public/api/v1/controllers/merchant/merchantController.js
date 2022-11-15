/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
module.exports = class MerchantController extends baseController {
    path = "/merchant";
    router = express.Router();
    msgController = new MsgController();
    constructor(props) {
        super(props); 
    }

    initialize() {
        return new Promise((resolve) => {
            this.router.post(this.path + "/getMerchants" , this.getMerchants); 
            this.router.post(this.path + "/getMetrics" , this.getMerchants); 
            resolve({ MSG: "INITIALIZED SUCCESSFULLY" })
        });
    } 


    getMerchants = async(req, res,next)=>{ 
        // var options = {} 
        // let merchants = await this.readAll(options, 'merchant'); 
        let merchants = [];
        console.log("API CALLED")
        this.sendResponse({data: merchants}, res, 200)
    }   
}
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class DefaultDiscountController extends baseController{
    path = "/merchant/defaultdiscount";
    router = express.Router();
    msgController = new MsgController();
    routes = [];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "get",
                    authorization:'authorizationAuth'
                }, 
            ]
            // this.router.post(this.path+"/save", authenticate.authorizationAuth, this.save); 
            // this.router.get(this.path+"/get", authenticate.authorizationAuth, this.get); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    save = async(req,res,next)=>{
        var input = req.input;

        input.merchantId = req.deviceDetails.merchantId;
        input.status = 1;
        input.createdBy= req.userData.id;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.id;
        input.updatedDate = this.getDate();
        delete input["id"]
        this.update('mDefaultDiscountDivision', {status:0, updatedBy: req.userData.id, updatedDate: this.getDate()}, {where:{merchantId: req.deviceDetails.merchantId}}).then(resa=>{
            this.create('mDefaultDiscountDivision', input).then(resp=>{
                this.sendResponse({message:"Saved sucessfully"}, res, 200)
            }) 
        });
    }

    get= async (req,res,next)=>{ 
        let commission = await this.readAll({
            where:{
                "status": "1",
                merchantId: req.deviceDetails.merchantId
            },
        }, 'mDefaultDiscountDivision')
        // console.log(commission)
        this.sendResponse({ data: commission}, res, 200);
    }

}
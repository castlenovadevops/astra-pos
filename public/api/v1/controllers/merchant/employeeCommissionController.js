const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class EmployeeCommissionController extends baseController{
    path = "/merchant/employeecommission";
    router = express.Router();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => { 
            this.router.post(this.path+"/getCommission", authenticate.authorizationAuth, this.getCommission);  
            this.router.post(this.path+"/saveCommission", authenticate.authorizationAuth, this.saveCommission);  
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }

    getCommission= async(req, res, next)=>{
        var input = req.input;

        let options = {
            where:{
                merchantId: req.userData.merchantId,
                mEmployeeId: input.mEmployeeId,
                status:1
            }
        }

        this.readOne(options, 'mEmployeeCommission').then(commission=>{
            this.sendResponse({data: commission}, res, 200)
        })
    }


    saveCommission = async(req, res, next)=>{
        var input = req.input;
        input.merchantId = req.userData.merchantId;
        input.createdBy = req.userData.id
        input.updatedBy = req.userData.id
        input.createdDate = this.getDate()
        input.updatedDate = this.getDate()
        console.log(input);
        this.update('mEmployeeCommission', {status:0, updatedDate: this.getDate(), updatedBy: req.userData.id}, {where:{merchantId: req.userData.merchantId, mEmployeeId: input.mEmployeeId, status:1}}).then(r=>{
            this.create('mEmployeeCommission', input).then(r=>{
                this.sendResponse({message:"Commission details saved successfully."}, res, 200);
            })
        })
    }
}
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class DefaultCommissionController extends baseController{
    path = "/merchant/defaultcommission";
    router = express.Router();
    msgController = new MsgController();
    routes = []; 

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
            this.router.post(this.path+"/save", authenticate.authorizationAuth, this.save); 
            this.router.get(this.path+"/get", authenticate.authorizationAuth, this.get); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  

    save = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.userData.merchantId;
        input.status = 1;
        input.createdBy= req.userData.id;
        input.createdDate = this.getDate();
        delete input.id;
        input.updatedBy= req.userData.id;
        input.updatedDate = this.getDate();  
        this.update('mDefaultCommission', {status:0, updatedBy: req.userData.id, updatedDate: this.getDate()}, {where:{merchantId: req.userData.merchantId}}).then(resa=>{
            this.create('mDefaultCommission', input).then(resp=>{
                this.readOne({where:{
                    mEmployeeId:{
                        [Sequelize.Op.in]:Sequelize.literal("(select mEmployeeId from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeRole in (select roleId from lkup_role where merchantId='"+req.userData.merchantId+"' and roleName='Owner'))")
                    }
                },
            include:[
                {
                    model:this.models.mEmployeeCommission,
                    where:{status:1, merchantId: req.userData.merchantId},
                    required: false 
                }
            ]}, 'merchantEmployees').then(owner=>{
                console.log(owner.dataValues)
                    if(owner.dataValues.mEmployeeCommissions.length === 0){ 
                        var empInput = {
                            merchantId: req.userData.merchantId,
                            mEmployeeId: owner.mEmployeeId,
                            minimumSalary:'',
                            mOwnerPercentage: input.mOwnerPercentage,
                            mEmployeePercentage: input.mEmployeePercentage,
                            mCashPercentage: input.mCashPercentage,
                            mCheckPercentage: input.mCheckPercentage,
                            mTipsCashPercentage: input.mTipsCashPercentage,
                            mTipsCheckPercentage: input.mTipsCheckPercentage,
                            createdBy: req.userData.id,
                            updatedBy: req.userData.id,
                            createdDate: this.getDate(),
                            updatedDate: this.getDate()
                        } 
                        this.update('mEmployeeCommission', {status:0, updatedDate: this.getDate(), updatedBy: req.userData.id}, {where:{merchantId: req.userData.merchantId, mEmployeeId: empInput.mEmployeeId, status:1}}).then(r=>{
                            this.create('mEmployeeCommission', empInput).then(r=>{
                                this.sendResponse({message:"Commission details saved successfully."}, res, 200);
                            })
                        })
                    }
                    else{
                        this.sendResponse({message:"Commission details saved sucessfully"}, res, 200)
                    }
                })
            }) 
        })
    }

    get= async (req,res,next)=>{ 
        let commission = await this.readAll({
            where:{
                "status": 1,
                merchantId: req.userData.merchantId
            },
        }, 'mDefaultCommission')
        this.sendResponse({ data: commission}, res, 200);
    }

}
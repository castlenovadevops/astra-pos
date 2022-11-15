/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index');  
const { Sequelize } = require('sequelize'); 
module.exports = class EmployeeController extends baseController{
    path = "/merchant/employee";
    router = express.Router();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            this.router.get(this.path+"/getMerchants", authenticate.authorizationAuth, this.getMerchants); 
            this.router.post(this.path+"/save", authenticate.authorizationAuth, this.save); 
            this.router.get(this.path+"/get", authenticate.authorizationAuth, this.get); 
            this.router.get(this.path+"/getAll", authenticate.authorizationAuth, this.getAll); 
            this.router.post(this.path+"/update", authenticate.authorizationAuth, this.updateEmployee); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getMerchants=async(req, res, next)=>{
        var options = {
            where:{
                mEmployeeId: req.userData.id,
                mEmployeeStatus:1
            },
            attributes:{
                include:[
                    [
                        Sequelize.literal("(select merchantName from merchant where merchantId = `mEmpRefMerchant`.`merchantId` )"),
                        'merchantName'
                    ],

                    [
                        Sequelize.literal("(select roleName from lkup_role where roleId = `mEmpRefMerchant`.`mEmployeeRole` )"),
                        'mEmployeeRoleName'
                    ]
                ]
            }
        }
        this.readAll(options, `mEmpRefMerchant`).then(merchants=>{
            this.sendResponse({data: merchants}, res, 200)
        })
    }

    save = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.userData.merchantId;
        input.mEmployeeStatus = '1';
        input.createdBy= req.userData.id;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.id;
        input.updatedDate = this.getDate(); 

        console.log(input)
        if(input.mEmployeeEmail !== ''){
            this.readOne({where:{email: input.mEmployeeEmail}}, 'email_index').then(async (emailRecord)=>{
                if(emailRecord !== null && emailRecord.recordType === 'CN'){
                    return this.sendResponse({message: this.cnemployeeexist, field:'mEmployeeEmail'}, res, 400)
                }
                else if(emailRecord !== null && emailRecord.recordType === 'MA'){
                    return this.sendResponse({message: this.cnmaexist, field:'mEmployeeEmail'}, res, 400)
                }
                else if(emailRecord !== null && emailRecord.recordType === 'A'){
                    return this.sendResponse({message: this.cnaexist, field:'mEmployeeEmail'}, res, 400)
                }
                else if(emailRecord !== null &&  emailRecord.recordType === 'M'){
                    var userdetails = await this.getUserDetailByEmail(input.mEmployeeEmail, emailRecord, res);
                    console.log(input.mEmployeeEmail, userdetails)
                    if(input.mEmployeeRole === 'Admin'){
                        var options = {where:{ 
                            mEmployeeRole: {
                                [Sequelize.Op.in]:Sequelize.literal("(select roleId from lkup_role where (roleName='Employee' or roleName='Owner') and merchantId is not null and merchantId!='')")
                            }
                        }}
                        if(input.id !== undefined){
                            options = {where:{
                                mEmployeeId:input.id,
                                mEmployeeRole: {
                                    [Sequelize.Op.in]:Sequelize.literal("(select roleId from lkup_role where (roleName='Employee' or roleName='Owner') and merchantId is not null and merchantId!='')")
                                }
                            }}
                        }
                        this.readAll(options, 'mEmpRefMerchant').then(rec=>{
                            if(rec.length > 0){
                                return this.sendResponse({message:this.memployeeEmpexist, field:'mEmployeeEmail'}, res, 400)
                            }
                            else{
                                this.checkPasscode(input, req, res , next)
                            }
                        })
                    }
                    else if(input.mEmployeeRole === 'Employee'){
                        var  options = {where:{ 
                            mEmployeeRole: {
                                [Sequelize.Op.in]:Sequelize.literal("(select roleId from lkup_role where (roleName='Admin' or roleName='Owner') and merchantId is not null and merchantId!='')")
                            }
                        }}
                        if(input.id !== undefined){
                            options = {where:{
                                mEmployeeId:input.id,
                                mEmployeeRole: {
                                    [Sequelize.Op.in]:Sequelize.literal("(select roleId from lkup_role where (roleName='Admin' or roleName='Owner') and merchantId is not null and merchantId!='')")
                                }
                            }}
                        }
                        this.readAll(options, 'mEmpRefMerchant').then(rec=>{
                            if(rec.length > 0){
                                return this.sendResponse({message:this.memployeeAdminexist, field:'mEmployeeEmail'}, res, 400)
                            }
                            else{
                                this.checkPasscode(input, req, res , next)
                            }
                        })
                    }
                }
                else{
                    this.checkPasscode(input, req, res, next);
                }
            })
        }
        else{
            this.checkPasscode(input, req, res, next);
        }
    }

    checkPasscode = async(input, req, res, next)=>{
        var options = {
            where:{
                mEmployeePasscode: input.mEmployeeCode,
                merchantId: req.userData.merchantId
            }
        }
        if(input.id){
            options.where ={
                mEmployeeId:{
                    [Sequelize.Op.ne]: input.id
                },
                mEmployeePasscode: input.mEmployeeCode,
                merchantId: req.userData.merchantId
            }
        }

        this.readAll(options, 'mEmpRefMerchant').then(results=>{
            if(results.length > 0){
                return this.sendResponse({message:this.mempPasscodeExist, field:'mEmployeeCode'}, res, 400)
            }
            else{
                this.saveEmpDetail(input, req, res, next)
            }
        })
    }

    saveEmpDetail = async(input, req, res, next)=>{
        if(input.id !== undefined){
            this.update('merchantEmployees', input, {where:{mEmployeeId :input.id}}).then(resp=>{
                this.update('mEmpRefMerchant', {mEmployeePasscode: input.mEmployeeCode, mEmployeeRole: input.mEmployeeRole, 
                    updatedBy: req.userData.id,
                    updatedDate: this.getDate()}, {where:{mEmployeeId: input.id, merchantId: req.userData.merchantId}}).then(resp=>{
                    this.sendResponse({message:"Updated sucessfully"}, res, 200)
                })
            })
        }
        else{
            this.create('merchantEmployees', input).then(resp=>{
                var refinput = {
                    merchantId: req.userData.merchantId,
                    mEmployeeId: resp.mEmployeeId,
                    mEmployeeRole: input.mEmployeeRole,
                    mEmployeePasscode: input.mEmployeeCode,
                    createdBy: req.userData.id,
                    createdDate: this.getDate()
                }
                this.create('mEmpRefMerchant', refinput).then(resp=>{
                    this.saveEmployeeCommission(refinput, req, res, next)
                })
            })
        }
    }

    saveEmployeeCommission = async(refinput, req, res, next)=>{
        var merchantId = refinput.merchantId
        var mEmployeeId = refinput.mEmployeeId
        this.readOne({where:{
            merchantId: merchantId,
            status:1
        }}, 'mDefaultCommission').then(commission=>{
            if(commission){ 
                var empInput = {
                    merchantId: merchantId,
                    mEmployeeId: mEmployeeId,
                    minimumSalary:'',
                    mOwnerPercentage: commission.mOwnerPercentage,
                    mEmployeePercentage: commission.mEmployeePercentage,
                    mCashPercentage: commission.mCashPercentage,
                    mCheckPercentage: commission.mCheckPercentage,
                    mTipsCashPercentage: commission.mTipsCashPercentage,
                    mTipsCheckPercentage: commission.mTipsCheckPercentage,
                    createdBy: req.userData.id,
                    updatedBy: req.userData.id,
                    createdDate: this.getDate(),
                    updatedDate: this.getDate()
                } 
                this.update('mEmployeeCommission', {status:0, updatedDate: this.getDate(), updatedBy: req.userData.id}, {where:{merchantId: req.userData.merchantId, mEmployeeId: empInput.mEmployeeId, status:1}}).then(r=>{
                    this.create('mEmployeeCommission', empInput).then(r=>{
                        this.sendResponse({message:"Saved successfully."}, res, 200);
                    })
                })
            }
            else{
                this.sendResponse({message:"Saved successfully"}, res, 200)
            }
        })
    }

    get = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ 
            [
                Sequelize.col('`merchantEmployees`.`mEmployeeId`'),
                `id`
            ],
            [
                Sequelize.literal("(select roleName from lkup_role where roleId = (select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`) )"),
                `mEmployeeRoleName`
            ],
            [
                Sequelize.literal("(select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                `mEmployeeRole`
            ],
            [
                Sequelize.literal("(select mEmployeeStatus from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                `mEmployeeStatus`
            ],
            [
                Sequelize.literal("(select mEmployeePasscode from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                `mEmployeeCode`
            ],
        ]
    },
        where:{
             mEmployeeId: {
                [Sequelize.Op.in] : Sequelize.literal("(select mEmployeeId from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeRole in (select roleId from lkup_role where merchantId='"+req.userData.merchantId+"' and roleName != 'Owner'))")
            }
        },
        include:[
            {
                model:this.models.mEmployeeCommission,
                where:{status:1, merchantId: req.userData.merchantId},
                required: false 
            }
        ]
        }, 'merchantEmployees')
        this.sendResponse({ data: customers}, res, 200);
    }


    getAll = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ 
            [
                Sequelize.col('`merchantEmployees`.`mEmployeeId`'),
                `id`
            ],
            [
                Sequelize.literal("(select roleName from lkup_role where roleId = (select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`) )"),
                `mEmployeeRoleName`
            ],
            [
                Sequelize.literal("(select mEmployeeRole from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                `mEmployeeRole`
            ],
            [
                Sequelize.literal("(select mEmployeeStatus from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                `mEmployeeStatus`
            ],
            [
                Sequelize.literal("(select mEmployeePasscode from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' and mEmployeeId=`merchantEmployees`.`mEmployeeId`)"),
                `mEmployeeCode`
            ],
        ]
    },
        where:{
             mEmployeeId: {
                [Sequelize.Op.in] : Sequelize.literal("(select mEmployeeId from mEmpRefMerchant where merchantId='"+req.userData.merchantId+"' )")
            }
        },
        include:[
            {
                model:this.models.mEmployeeCommission,
                where:{status:1, merchantId: req.userData.merchantId},
                required: false 
            }
        ]
        }, 'merchantEmployees')
        this.sendResponse({ data: customers}, res, 200);
    }


    updateEmployee = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        console.log(input)
        var data = {
            mEmployeeStatus: input.mEmployeeStatus,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        this.update('merchantEmployees', data, {where:{mEmployeeId:input.id}}).then(r1=>{
            this.sendResponse({message:"Customer details updated successfully."}, res, 200);
        })
    }

}
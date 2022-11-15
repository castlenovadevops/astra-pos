const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const jwt = require("jsonwebtoken");
const  {jwtOptions} = require('../../config/jwtOptions')
const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class EmployeeController extends baseController{
    path = "/merchant";
    router = express.Router();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            this.router.get(this.path+"/getMerchants", authenticate.authorizationAuth, this.getMerchants);  
            this.router.post(this.path+"/changeMerchantToken", authenticate.authorizationAuth, this.changeMerchantToken);  
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getMerchants=async(req, res, next)=>{
        var options = {
            where:{
                mEmployeeId: req.userData.id,
                mEmployeeStatus:1,
                merchantId:{
                    [Sequelize.Op.in]:Sequelize.literal("(select merchantId from merchant where merchantStatus='Verified')")
                }
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


    changeMerchantToken = async(req, res, next)=>{
        var userData = Object.assign({}, req.userData);
        userData.merchantId = req.input.merchantId; 
        let payload = { ...userData  }; 
        console.log(payload)
        let token = jwt.sign(payload, jwtOptions.secretOrKey); 
        return this.sendResponse({  token:token, userdetail: userData}, res, 200);
    }
}
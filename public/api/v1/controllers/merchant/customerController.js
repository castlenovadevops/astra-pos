const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class CustomerController extends baseController{
    path = "/merchant/customers";
    router = express.Router();
    msgController = new MsgController();
    routes=[];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            this.router.post(this.path+"/save", authenticate.authorizationAuth, this.saveCustomer); 
            this.router.get(this.path+"/getCustomer", authenticate.authorizationAuth, this.getCustomer); 
            this.router.post(this.path+"/updateCustomer", authenticate.authorizationAuth, this.updateCustomer); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveCustomer = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.deviceDetails.merchantId;
        input.mCustomerStatus = 1;
        input.createdBy= req.userData.id;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.id;
        input.updatedDate = this.getDate();
        // console.log(input)
        if(input.id != undefined){
            this.update('mCustomers', input, {where:{mCustomerId :input.id}}).then(resp=>{
                this.sendResponse({message:"Updated sucessfully"}, res, 200)
            })
        }
        else{
            this.create('mCustomers', input).then(resp=>{
                this.sendResponse({message:"Saved sucessfully"}, res, 200)
            })
        }
    }

    getCustomer = async (req,res,next)=>{ 
        let customers = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ [
            Sequelize.col('mCustomerId'),
            `id`
        ], ]},
        where:{
            merchantId:req.deviceDetails.merchantId
        }
        }, 'mCustomers')
        this.sendResponse({ data: customers}, res, 200);
    }

    updateCustomer = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            mCustomerStatus: input.mCustomerStatus,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        this.update('mCustomers', data, {where:{mCustomerId:input.id}}).then(r1=>{
            this.sendResponse({message:"Customer details updated successfully."}, res, 200);
        })
    }

}
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class DiscountController extends baseController{
    path = "/merchant/discounts";
    router = express.Router();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "getActive",
                    authorization:'authorizationAuth'
                }, 

                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveDiscount",
                    authorization:'authorizationAuth'
                }, 
                {
                    path:this.path+"/getDiscount",
                    type:"post",
                    method: "getDiscount",
                    authorization:'authorizationAuth'
                }, 
                {
                    path:this.path+"/updateDiscount",
                    type:"post",
                    method: "updateDiscount",
                    authorization:'authorizationAuth'
                }, 
            ]
            // this.router.post(this.path+"/save", authenticate.authorizationAuth, this.saveDiscount); 
            // this.router.get(this.path+"/getDiscount", authenticate.authorizationAuth, this.getDiscount); 
            // this.router.post(this.path+"/updateDiscount", authenticate.authorizationAuth, this.updateDiscount); 

            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveDiscount = async(req,res,next)=>{
        var input = req.input; 
        input.merchantId = req.userData.merchantId
        input.mDiscountStatus = 1;
        input.createdBy= req.userData.id;
        input.createdDate = this.getDate();

        input.updatedBy= req.userData.id;
        input.updatedDate = this.getDate(); 
        if(input.id != undefined){
            console.log(input)
            this.updateWithNew('mDiscounts', input, {where:{id:input.id}}, 'mDiscountStatus', 'id').then(resp=>{
                this.sendResponse({message:"Updated sucessfully"}, res, 200)
            })
        }
        else{
            this.create('mDiscounts', input).then(resp=>{
                this.sendResponse({message:"Saved sucessfully"}, res, 200)
            })
        }
    }
    getActive= async (req,res,next)=>{ 
        let discounts = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        where:{ 
            merchantId:req.userData.merchantId,
            mDiscountStatus:1,
            id:{
                [Sequelize.Op.in]:Sequelize.literal("(select id from mDiscounts where mDiscountStatus!=2)")
            }
        }

        // attributes:{include: [ [
        //     Sequelize.col('mDiscountId'),
        //     `id`
        // ], ]}
        }, 'mDiscounts')
        this.sendResponse({ data: discounts}, res, 200);
    }

    getDiscount = async (req,res,next)=>{ 
        let discounts = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        where:{ 
            merchantId:req.userData.merchantId,
            id:{
                [Sequelize.Op.in]:Sequelize.literal("(select id from mDiscounts where mDiscountStatus!=2)")
            }
        }

        // attributes:{include: [ [
        //     Sequelize.col('mDiscountId'),
        //     `id`
        // ], ]}
        }, 'mDiscounts')
        this.sendResponse({ data: discounts}, res, 200);
    }

    updateDiscount = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            mDiscountStatus: input.mDiscountStatus,
            updatedBy: req.userData.id,
            updatedDate: this.getDate()
        }
        this.update('mDiscounts', data, {where:{id:input.id}}).then(r1=>{
            this.sendResponse({message:"Discount details updated successfully."}, res, 200);
        })
    }

}
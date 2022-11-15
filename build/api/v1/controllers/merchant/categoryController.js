const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class CategoryController extends baseController{
    path = "/merchant/category";
    router = express.Router();
    msgController = new MsgController(); 
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            this.router.post(this.path+"/save", authenticate.authorizationAuth, this.saveCategory); 
            this.router.get(this.path+"/get", authenticate.authorizationAuth, this.getCategory); 
            this.router.post(this.path+"/update", authenticate.authorizationAuth, this.updateCategory); 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveCategory = async(req,res,next)=>{
        var input = req.input;
        input.merchantId = req.userData.merchantId;
        input.mCategoryStatus = 1;
        input.createdBy= req.userData.id;
        input.createdDate = this.getDate(); 
        input.updatedBy=  req.userData.id;
        input.updatedDate = this.getDate();
        console.log(input)
        if(input.id != undefined){
            this.update('mCategory', input, {where:{id :input.id}}).then(resp=>{
                this.sendResponse({message:"Updated sucessfully"}, res, 200)
            })
        }
        else{
            this.create('mCategory', input).then(resp=>{
                this.sendResponse({message:"Saved sucessfully"}, res, 200)
            })
        }
    }

    getCategory = async (req,res,next)=>{ 
        let category = await this.readAll({
            where:{
                merchantId:req.userData.merchantId
            },
            order: [
            ['createdDate','ASC']
        ],
        attributes:{include: [ [
            Sequelize.col('id'),
            `id`
        ], ]}
        }, 'mCategory')
        this.sendResponse({ data: category}, res, 200);
    }

    updateCategory = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            mCategoryStatus: input.mCategoryStatus,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        this.update('mCategory', data, {where:{id:input.id}}).then(r1=>{
            this.sendResponse({message:"Category details updated successfully."}, res, 200);
        })
    }
}
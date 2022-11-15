const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index'); 
const sequelize = require('sequelize');
const { Sequelize } = require('sequelize'); 
module.exports = class RegistrationController extends baseController{
    path = "/merchant/tax";
    router = express.Router();
    routes = [];
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveTax",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/get",
                    type:"post",
                    method: "getTax",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/getByType/:type",
                    type:"get",
                    method: "getByType"
                    // authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/update",
                    type:"post",
                    method: "updateTax",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/updateTaxDefault",
                    type:"post",
                    method: "updateTaxDefault",
                    authorization:"authorizationAuth"
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    saveTax= async(req,res,next)=>{
        var input = req.input;
        if(input.isDefault === null || input.isDefault === undefined || input.isDefault.length === 0){
            input.isDefault = '0'
            console.log( input.isDefault, input ,"ASDASD!@#!@#!@#!")
        } 
        this.readAll({where:{mTaxStatus:1, isDefault:1,  merchantId:req.userData.merchantId}}, 'mTax').then(async (response)=>{
            var taxids = response.map(r=>r.id)
            var throwErr =false;
            if(input.id !== undefined){
                if(taxids.indexOf(input.id) !== -1){
                    throwErr = true;
                }
            }
            else{
                throwErr = true;
            }

            if(throwErr && response.length>0   && input.isDefault.toString() === '1' && input.updateDefault === undefined){
                var taxes = response.map(r=>{ return "<li>"+r.mTaxName+"</li>"});
                var limsg = "<br/><ul className='errorDivs'>"+taxes.join("")+"</li>";
                this.sendResponse({status:405, message:this.mDefaultTax+limsg}, res, 405)
            }
            else{ 
                if(input.updateDefault){ 
                    await this.update('mTax', {isDefault: 0, updatedBy: req.userData.id, updatedDate: this.getDate()}, {where:{isDefault: 1, merchantId: req.userData.merchantId }})
                }
                input.createdBy= req.userData.id;
                input.createdDate = this.getDate();
                input.updatedBy= req.userData.id;
                input.merchantId = req.userData.merchantId;
                input.updatedDate = this.getDate();
                // input.isDefault = req.input.isDefault[0]
                input.isDefault = input.isDefault !== undefined ? input.isDefault[0] : '0';
                
                console.log(input)
                if(input.id != undefined){
                    this.updateWithNew('mTax', input, {where:{id:input.id}}, 'mTaxStatus', 'id').then(resp=>{
                        this.sendResponse({message:"Updated sucessfully"}, res, 200)
                    })
                }
                else{ 
                    this.create('mTax', input).then(resp=>{
                        this.sendResponse({message:"Saved sucessfully"}, res, 200)
                    })
                } 
            }
        })
    }
    getByType= async (req,res,next)=>{ 
        // var type = req.params.type;
        // var where = {
        //     merchantId: req.userData.merchantId,
        //     mTaxStatus:{
        //         [Sequelize.Op.ne]:2
        //     },
        // }
        // if(type === 'default'){
        //     where = {
        //         merchantId: req.userData.merchantId,
        //         mTaxStatus:{
        //             [Sequelize.Op.ne]:2
        //         },
        //         isDefault:1
        //     }
        // }
        // let tax = await this.readAll({where: where, order: [
        //     ['createdDate','ASC']
        // ],
        // // attributes:{include: [ [
        // //     Sequelize.col('mTaxId'),
        // //     `id`
        // // ], ]}
        // }, 'mTax')
        // var tax=[];
        // console.log("TAX SERVICE CALLED::::::")
        // this.sendResponse({ data: tax}, res, 200);
        res.send({statsu:200, data:"SUCCESS"})
    }

    getTax = async (req,res,next)=>{ 
        let tax = await this.readAll({order: [
            ['createdDate','ASC']
        ],
        where:{  merchantId:req.userData.merchantId,
            id:{
            [Sequelize.Op.in]:Sequelize.literal("(select id from mTax where mTaxStatus!=2)")
        } }
        // attributes:{include: [ [
        //     Sequelize.col('mTaxId'),
        //     `id`
        // ], ]}
        }, 'mTax')
        this.sendResponse({ data: tax}, res, 200);
    }

    updateTax = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            mTaxStatus: input.status,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
 
        this.update('mTax', data, {where:{id:input.id}}).then(r1=>{
            this.sendResponse({message:"Tax details updated successfully."}, res, 200);
        }) 
    }

    updateTaxDefault = async(req, res,next)=>{ 
        const input = req.input; 
        const user = req.userData;  
        var data = {
            isDefault: input.isDefault,
            updatedBy: user.id,
            updatedDate: this.getDate()
        }
        console.log(input)

        this.readAll({where:{mTaxStatus:1, isDefault:1,  merchantId:req.userData.merchantId}}, 'mTax').then(async (response)=>{
            var taxids = response.map(r=>r.id)
            var throwErr =false;
            if(input.id !== undefined){
                if(taxids.indexOf(input.id) === -1){
                    throwErr = true;
                }
            }
            else{
                throwErr = true;
            }
            if(throwErr && response.length>0 &&  input.isDefault.toString() === '1' && input.updateDefault === undefined){ 
                var taxesstr = '';
                var endnum = response.length > 3 ? 3 : response.length
                for(var i=0;i< endnum;i++){
                    taxesstr +="<li>"+response[i].mTaxName;
                    if(i==endnum-1 && response.length > 3){
                        taxesstr+="...+"+(response.length-endnum)+" more"
                    }
                    taxesstr+="</li>"
                } 
                var limsg = "<br/><ul className='errorDivs'>"+taxesstr+"</li>";
                this.sendResponse({status:405, message:this.mDefaultTax+limsg}, res, 405)
            }
            else{ 

                if(input.updateDefault == 1){ 
                    await this.update('mTax', {isDefault: 0, updatedBy: req.userData.id, updatedDate: this.getDate()}, {where:{isDefault: 1, merchantId: req.userData.merchantId }})
                }
                console.log(input)
                this.update('mTax', data, {where:{id:input.id}}).then(r1=>{
                    this.sendResponse({message:"Tax details updated successfully."}, res, 200);
                })
            }
        });
    }
}
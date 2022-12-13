const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
const CommonController  = require('../common/commonController');

const express = require('express');
const authenticate = require('../../middleware/index');  
const Sequelize   = require('sequelize'); 


module.exports = class GiftCardController extends baseController{
    path = "/merchant/giftcard";
    router = express.Router();
    routes = [];
    msgController = new MsgController();
    commonController = new CommonController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [    
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveCard",
                    authorization:'authorizationAuth'
                },   
                {
                    path:this.path+"/disable",
                    type:"post",
                    method: "updateCard",
                    authorization:'authorizationAuth'
                },    
                {
                    path:this.path+"/getCards",
                    type:"post",
                    method: "getCards",
                    authorization:'authorizationAuth'
                },    
            ]     

            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 


    getCards = async(req,res, next)=>{
        const giftcards = await this.readAll({where:{status:'Active', merchantId: req.deviceDetails.merchantId}}, 'giftCards')
       
        this.sendResponse({data: giftcards}, res, 200);
    }

    saveCard = async(req, res, next)=>{
        var input= req.input;
        input["createdBy"] = req.userData.mEmployeeId;
        input["createdDate"] = this.getDate();
        input["updatedBy"] = req.userData.mEmployeeId;
        input["updatedDate"] = this.getDate();
        console.log(input)
        input["validFrom"] = input.validFrom.replace("T"," ").replace("Z","");
        input["validTo"] = input.validTo.replace("T"," ").replace("Z","");
        input["merchantId"] =  req.deviceDetails.merchantId;
        delete input["id"]; 
        if(input.cardType === 'Digital'){
            var cardnumber = this.generaterandomNumber(12);
            var existrecords = await this.readAll({where:{cardNumber: cardnumber, merchantId:input.merchantId}},'giftCards');
            if(existrecords.length> 0){
                this.saveCard(req,res,next);
            }
            else{
                input["cardNumber"]=cardnumber;
                input["cardBalance"]=input.cardValue;
                this.create('giftCards', input).then(r=>{
                    this.sendResponse({message:"Gift card has been saved successfully."}, res, 200)
                }) 
            }
        }
        else{
            input["cardBalance"]=input.cardValue;
            this.create('giftCards', input).then(r=>{
                this.sendResponse({message:"Gift card has been saved successfully."}, res, 200)
            }) 
        }
    }
  
    updateCard = async(req, res, next)=>{
        var input= req.input; 
        input["updatedDate"] = this.getDate(); 
        this.update('giftCards', input, {where:{id:input.id}}).then(r=>{
            this.sendResponse({message:"Gift card has been saved successfully."}, res, 200)
        }) 
    }
}
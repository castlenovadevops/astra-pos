/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
const  Sequelize  = require('sequelize');
const fontList = require('font-list');
const { sequelize } = require('../../models');
const moment = require('moment'); 

const find = require('local-devices');
module.exports = class SyncTaxController extends baseController{
    path = "/pos/syssettings";
    router = express.Router();
    routes = [];
    apiManager = new APIManager();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [ 
                {
                    path:this.path+"/getSettingsByFeature",
                    type:"post",
                    method: "getSettingsByFeature",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getSettings",
                    type:"post",
                    method: "getSettings",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/saveSettings",
                    type:"post",
                    method: "saveSettings",
                    authorization:'accessAuth'
                },  
                
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    }  


    getSettings = async(req, res, next)=>{
        const settings = await this.readAll({where:{status:1}}, 'sys_settings')
        this.sendResponse({data: settings}, res, 200)
    }

    getSettingsByFeature= async(req, res, next)=>{
        const settings = await this.readOne({where:req.input}, 'sys_settings')
        this.sendResponse({data: settings}, res, 200)
    }

    saveSettings = async(req, res, next)=>{
        var input = Object.assign({},  req.input);  
        console.log(input)
        this.update('sys_settings', {status:0}, {where:{
            feature: input.feature
        }}).then(r=>{
            this.create('sys_settings', input).then(r=>{
                this.sendResponse({data:"Saved successfully"}, res, 200)
            })
        })
    } 
}
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
 
const fontList = require('font-list')

module.exports = class SyncTaxController extends baseController{
    path = "/pos/print";
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
                    path:this.path+"/getPrinters",
                    type:"post",
                    method: "getPrinters",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getFonts",
                    type:"post",
                    method: "getFonts",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/savePrinter",
                    type:"post",
                    method: "savePrinter",
                    authorization:'accessAuth'
                }, 
                {
                    path:this.path+"/updatePrinter",
                    type:"post",
                    method: "updatePrinter",
                    authorization:'accessAuth'
                }
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getFonts = async(req, res, next) =>{ 
        fontList.getFonts({ disableQuoting: true })
        .then(fonts => {
            var data = fonts.map(f=>{
                return {
                    label:f,
                    key: f,
                    value: f
                }
            })
            this.sendResponse({data: data}, res, 200)
        })
        .catch(err => {
            console.log(err)
            this.sendResponse({data: []}, res, 200)
        })
    }


    getPrinters = async(req, res, next)=>{
        const printers = await this.readAll({}, 'printers')
        this.sendResponse({data: printers}, res, 200)
    }

    savePrinter = async(req, res, next)=>{
        var input = Object.assign({},  req.input);
        var print = req.input.print
        input.BillPrint = print.indexOf('Bill') !== -1 ? 1 : 0
        input.ReportPrint = print.indexOf('Report') !== -1 ? 1 : 0
        delete input["print"]
        this.create('printers', input).then(r=>{
            this.sendResponse({data:"Saved successfully"}, res, 200)
        })
    }

    updatePrinter = async(req, res, next)=>{
        var input = Object.assign({},  req.input);   
        this.update('printers', input, {where:{id: input.id}}).then(r=>{
            this.sendResponse({data:"Saved successfully"}, res, 200)
        })
    }
}
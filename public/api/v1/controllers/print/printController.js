/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const APIManager = require('../../utils/apiManager'); 
const  Sequelize  = require('sequelize');
const fontList = require('font-list');
const { sequelize } = require('../../models');

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
                }, 
                {
                    path:this.path+"/getPrintHTML",
                    type:"post",
                    method: "getPrintHTML",
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
        if(input.BillPrint !== undefined){
            await this.update('printers',{BillPrint:0}, {where:{
                id:{
                    [Sequelize.Op.in] : sequelize.literal("select id from printers")
                }
            }})
        }
        if(input.ReportPrint !== undefined){
            await this.update('printers',{ReportPrint:0}, {where:{
                id:{
                    [Sequelize.Op.in] : sequelize.literal("select id from printers")
                }
            }})
        }
        this.update('printers', input, {where:{id: input.id}}).then(r=>{
            this.sendResponse({data:"Saved successfully"}, res, 200)
        })
    }

    getPrintHTML = async(req, res, next)=>{
        var input = req.input
        var input = req.input;
        let options = {
            include:[
                {
                    model: this.models.mCustomers,
                    required: false
                },
                {
                    model: this.models.merchantEmployees,
                    required: false
                }, 
                {
                    model: this.models.ticketdiscount,
                    required: false,
                    where:{
                        status:1
                    }
                }, 
                {
                    model: this.models.ticketpayment,
                    required: false, 
                }, 
                {
                    model: this.models.ticketservices,
                    required: false, 
                    include:[
                        {
                            model: this.models.ticketTips,
                            required: false,
                            where:{
                                status:1
                            }
                        },
                        {
                            model: this.models.ticketservicetax,
                            required: false,
                            where:{
                                status:1
                            }
                        },
                        {
                            model: this.models.ticketservicediscount,
                            required: false,
                            where:{
                                status:1
                            }
                        }
                    ]
                }, 
            ],
            where:{
                ticketStatus:'Active', 
                ticketId: input.ticketId
            },
            attributes:{
                include:[
                    [
                        Sequelize.col('`tickets`.`ticketId`'),
                        'id'
                    ]
                ]
            }
        }

        this.readOne(options, 'tickets').then(async (results)=>{
            var billprinters = await this.readOne({where:{BillPrint: 1}}, 'printers')
            var printer = billprinters != null ? billprinters.dataValues : {} 
            var merchantdetail = req.deviceDetails;
            console.log(printer)
            var html = `<div style="max-width:100%; border:1px solid #000;font-family:'`+printer.fontFamily+`'; font-size:'`+printer.fontSize+`'">`;
            html+=`<div style='display:flex;align-items:center;justify-content:center;'><h5 style='font-size:18px;font-weight:bold;'>`+printer.Title+`</h5></div>`
            html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
            html += `<div>`+merchantdetail.merchantAddress1+`</div>`
            html += `<div>`+merchantdetail.merchantAddress2+`</div>`
            html += `<div>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipCode+`</div>`
            html+=`</div>`

            html+=`</div>`;
            this.sendResponse({htmlMsg: html, printers: printer}, res, 200);
        })
    }
}
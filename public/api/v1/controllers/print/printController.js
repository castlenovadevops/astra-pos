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
                    path:this.path+"/getPrinterByType",
                    type:"post",
                    method: "getPrinterByType",
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
                },
                {
                    path:this.path+"/getTxnPrintHTML",
                    type:"post",
                    method: "getTransactionPrintHTML",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getBatchPrintHTML",
                    type:"post",
                    method: "getBatchPrintHTML",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getDevices",
                    type:"post",
                    method: "getDevices",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/getGiftcardPrintHTML",
                    type:"post",
                    method: "getGiftcardPrintHTML",
                    authorization:'accessAuth'
                },
                
                
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
            //console.log(err)
            this.sendResponse({data: []}, res, 200)
        })
    }


    getPrinters = async(req, res, next)=>{
        const printers = await this.readAll({}, 'printers')
        this.sendResponse({data: printers}, res, 200)
    }

    getPrinterByType= async(req, res, next)=>{
        const printers = await this.readAll({where:req.input}, 'printers')
        this.sendResponse({data: printers}, res, 200)
    }

    savePrinter = async(req, res, next)=>{
        var input = Object.assign({},  req.input);
        var print = req.input.print
        input.BillPrint = print.indexOf('Bill') !== -1 ? 1 : 0
        input.ReportPrint = print.indexOf('Report') !== -1 ? 1 : 0
        input.fontFamily = '';
        input.fontSize  = ''
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
                    [Sequelize.Op.in] : sequelize.literal("(select id from printers)")
                }
            }})
        }
        if(input.ReportPrint !== undefined){
            await this.update('printers',{ReportPrint:0}, {where:{
                id:{
                    [Sequelize.Op.in] : sequelize.literal("(select id from printers)")
                }
            }})
        }
        this.update('printers', input, {where:{id: input.id}}).then(r=>{
            this.sendResponse({data:"Saved successfully"}, res, 200)
        })
    }

    getPrintHTML = async(req, res, next)=>{
        var input = req.input 
        var billtype = input.billtype || 'bill'

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
                    },
                    include:[ 
                        {
                            model: this.models.mDiscounts,
                            required: false, 
                            attributes:['mDiscountName']
                        }
                    ]
                }, 
                {
                    model: this.models.ticketpayment,
                    required: false, 
                }, 
                {
                    model: this.models.ticketservices,
                    required: false, 
                    where:{
                        status:1
                    },
                    include:[
                        {
                            model: this.models.merchantEmployees,
                            required: false, 
                        },
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
                            },
                            include:[ 
                                {
                                    model: this.models.mDiscounts,
                                    required: false, 
                                    attributes:['mDiscountName']
                                }
                            ]
                        },
                        {
                            model: this.models.mProducts,
                            required: false, 
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
            var ticketdetail = results.dataValues||results;
            //console.log("ticketdetail")
            //console.log(ticketdetail)
            var html = `<div style="max-width:100%;display:inline;font-family:'Arial'" >`; // div1
            html+=`<div style='display:flex;align-items:center;justify-content:center;'><p style='font-size:16px;font-weight:bold;'>`+printer.Title+`</p></div>`
            
            html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
            html += `<div style='max-width:100%;width:100%;font-size:12px;text-align:center;    white-space: nowrap;'>`+merchantdetail.merchantAddress1+(merchantdetail.merchantAddress2 !== '' ? ','+merchantdetail.merchantAddress2 : '')+`</div>`
            html += `<div style='max-width:100%;width:100%;font-size:12px;text-align:center;    white-space: nowrap;'>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipcode+`</div>`
            html+=`</div>`
            html+=`<div style='display:flex;align-items:center;margin:1rem 0 0.5rem;justify-content:center;'><p style='font-size:16px;font-weight:bold;'>ORDER: Ticket - `+ticketdetail.ticketCode+`</p></div>`
                
            console.log("BITLL TYE ", billtype)
            if(billtype === 'bill' || billtype === 'receipt'){
                // html+=`<div style='display:flex;align-items:center;justify-content:center;width:100%;'><p style='font-size:12px;font-weight:bold;'>`+(printer.Title)+`</p></div>`
                // html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
                // html += `<div>`+merchantdetail.merchantAddress1+`</div>`
                // html += `<div>`+merchantdetail.merchantAddress2+`</div>`
                // html += `<div>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipcode+`</div>`
                // html+=`</div>`
                // html+=`<div style='display:flex;align-items:center;margin:1rem 0 0.5rem;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>ORDER: Ticket - `+ticketdetail.ticketCode+`</p></div>`


                html+=`<div><div style='max-width:100%;width:100%;font-size:12px;text-align:left;    white-space: nowrap;'>Cashier: `+ticketdetail.merchantEmployee.mEmployeeFirstName+` `+ticketdetail.merchantEmployee.mEmployeeLastName+`</div>
                <div style='max-width:100%;width:100%;font-size:12px;text-align:left;    white-space: nowrap;'>`+moment.utc(ticketdetail.createdDate.replace("T"," ").replace("Z","")).local().format('DD-MMM-YYYY hh:mm a')+`</div>
                </div>`
                
                html+=`<div style='width:100%;display:flex;align-items:baseline;flex-direction:column;font-size:11px;'>` // div2
                ticketdetail.ticketservices.forEach((service, i)=>{ 
                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;font-size:12px;width:100%'>`;
                    html +=`<div style='max-width:20px;font-size:12px;width:20px;text-align:left;'>`+service.serviceQty+`</div>`;
                    html +=`<div style='max-width:150px;width:150px;text-align:left;font-size:12px; '>`+service.mProduct.mProductName+`</div>`

                    html +=`<div style='max-width:100px;width:100px;font-size:12px;text-align:right;padding-right:10px;'>$`+(Number(service.serviceQty)*Number(service.servicePerUnitCost)).toFixed(2)+`</div>`
                    html +=`</div>`
                    var taxes = service.ticketservicetaxes.map(t=>{
                        var taxhtml = ''
                        taxhtml+=`<div style='display:flex;align-items:flex-start;justify-content:space-between;width:100%'>`; 
                        taxhtml +=`<div style='max-width:20px;font-size:12px;width:20px;text-align:left;'>&nbsp;</div><div style='max-width:calc(100% - 120px);width:calc(100% - 120px);font-size:11px;text-align:left;    white-space: nowrap;'>`+t.mTaxName+`&nbsp;&nbsp;`+(t.mTaxType === 'Percentage' ? t.mTaxValue+"%" : "$"+t.mTaxValue)+`</div>`
        
                        taxhtml +=`<div style='max-width:100px;width:100px;font-size:12px;text-align:right;padding-right:10px;'>$`+Number(t.mTaxAmount).toFixed(2)+`</div>`
                        taxhtml +=`</div>`
                        return taxhtml
                    })

                    var discounts = service.ticketservicediscounts.map(t=>{
                        var Discounthtml = ''
                        Discounthtml+=`<div style='display:flex;align-items:start;justify-content:space-between;width:100%'>`; 
                        Discounthtml +=`<div style='max-width:20px;font-size:12px;width:20px;text-align:left;'>&nbsp;</div><div style='max-width:calc(100% - 120px);width:calc(100% - 120px);font-size:11px;text-align:left;    white-space: nowrap;'>`+t.mDiscount.mDiscountName+`&nbsp;&nbsp;`+(t.mDiscountType === 'Percentage' ? t.mDiscountValue+"%" : "$"+t.mDiscountValue)+`</div>`
        
                        Discounthtml +=`<div style='max-width:100px;width:100px;font-size:12px;text-align:right;padding-right:10px;'>($`+Number(t.mDiscountAmount).toFixed(2)+`)</div>`
                        Discounthtml +=`</div>`
                        return Discounthtml
                    })

                    html+= taxes.join("")
                    html+= discounts.join("")
                    if(i === ticketdetail.ticketservices.length-1){ 

                        if(ticketdetail.ticketdiscounts.length>0){
                            var tdiscounts = ticketdetail.ticketdiscounts.map(t=>{
                                var Discounthtml = ''
                                Discounthtml+=`<div style='display:flex;align-items:baseline;justify-content:space-between;width:100%'>`; 
                                Discounthtml +=`<div style='max-width:calc(100% - 150px);width:calc(100% - 150px);font-size:11px;text-align:left;    white-space: nowrap;'>`+t.mDiscount.mDiscountName+`&nbsp;&nbsp;`+(t.mDiscountType === 'Percentage' ? t.mDiscountValue+"%" : "$"+t.mDiscountValue)+`</div>`
                
                                Discounthtml +=`<div style='max-width:150px;width:150px;font-size:12px;text-align:right;padding-right:10px;'>($`+Number(t.mDiscountAmount).toFixed(2)+`)</div>`
                                Discounthtml +=`</div>`
                                return Discounthtml
                            })
                            html+= "<div style='margin:1rem 0 0;'>"+tdiscounts.join("")+"</div>"
                        }

                        html+=`<div style='display:flex;width:100%;align-items:center;margin:0.5rem 0 0.5rem;justify-content:space-between;'><p style='font-size:15px;font-weight:bold;'> Total</p><p style='font-size:15px;font-weight:bold;text-align:right;padding-right:10px;'> $`+Number(ticketdetail.ticketTotalAmount).toFixed(2)+`</p></div>`


                        if(billtype === 'bill'){
                            html+=`<div style='width:100%; ><p style='margin-bottom:0'>Enjoy</p>
                            <p style='margin-top:0'>`+printer.footerText+`</p>
                            </div>`

                            html+=`</div>` // div2
                            html+=`</div>`;// div1
                            this.sendResponse({htmlMsg: html, printers: printer}, res, 200);
                        }
                        else if (billtype === 'receipt'){ 
                            var paymentHTML = ''
                            console.log("RECEIPT PRINTING", ticketdetail.ticketpayments)
                            var isCardpaid= false;
                            ticketdetail.ticketpayments.forEach((t, ti)=>{
                                if(t.payMode.toLowerCase() === 'card'){
                                    isCardpaid = true;
                                }
                                paymentHTML+=`<div style='display:flex;align-items:baseline;justify-content:space-between;width:100%'>`; 
                                paymentHTML +=`<div style='max-width:calc(100% - 150px);width:calc(100% - 150px);text-transform:capitalize;display:flex;align-items:flex-start; '>`+t.payMode+`&nbsp;&nbsp;`+(t.payMode.toLowerCase() !== 'cash' ? "("+t.paymentType+")" : "")+`</div>`
                
                                paymentHTML +=`<div style='max-width:150px;width:100px;text-align:right;padding-right:10px;'>$`+Number(t.ticketPayment).toFixed(2)+`</div>`
                                paymentHTML +=`</div>`
                                if(ti === ticketdetail.ticketpayments.length-1){ 
                                    if(isCardpaid){
                                        html+=`<div style='display:flex;width:100%;align-items:center;margin:1rem 0 0.5rem;justify-content:space-between;'><p style='font-size:15px;font-weight:bold;'> Tip</p><p style='font-size:15px;font-weight:bold;text-align:right;padding-right:10px;border-bottom:1px dotted #000;width:100px;'></p></div>`
                                    }
                                    html+= paymentHTML
                                    html+=`<div style='width:100%; ><p style='margin-bottom:0'>Enjoy</p>
                                    <p style='margin-top:0'>`+printer.footerText+`</p>
                                    </div>`

                                    html+=`</div>` // div2
                                    html+=`</div>`;// div1
                                    this.sendResponse({htmlMsg: html, printers: printer}, res, 200);
                                }
                            })
                        }
                    }
                })

                
            }
            else {
                var employees = []
                var employeehtml = {}  

                ticketdetail.ticketservices.forEach((service,i)=>{
                    var ehtml = {
                        html: '',
                        total: 0,
                        tips:0,
                        supplies:0
                    };
                    if(employees.indexOf(service.merchantEmployee.mEmployeeId) === -1){  
                        ehtml.html+=`<div style='display:flex;align-items:center;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>`+printer.Title+`</p></div>`
            
                        ehtml.html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
                        ehtml.html += `<div>`+merchantdetail.merchantAddress1+`</div>`
                        ehtml.html += `<div>`+merchantdetail.merchantAddress2+`</div>`
                        ehtml.html += `<div>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipcode+`</div>`
                        ehtml.html+=`</div>`
                        ehtml.html+=`<div style='display:flex;align-items:center;margin:1rem 0 0.5rem;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>ORDER: Ticket - `+ticketdetail.ticketCode+`</p></div>`
                            
                        ehtml.html+=`<div style='display:flex;align-items:center;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>`+printer.Title+`</p></div>`
                 
                        ehtml.html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
                        ehtml.html += `<div>Employee Receipt</div>`
                        ehtml.html += `<div>`+moment.utc(this.getDate()).local().format('MM/DD/YYYY  hh:mm a')+`</div>`
                        ehtml.html+=`</div>`
                        ehtml.html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;'><p style='margin-bottom:0;max-width:calc(100% - 150px)'>Employee:&nbsp;&nbsp;<b>`+service.merchantEmployee.mEmployeeFirstName+` `+service.merchantEmployee.mEmployeeLastName+`</b></p> <p style='max-width:150px'>Ticket:&nbsp;<b>`+ticketdetail.ticketCode+`</b></p> </div>` 
                        employees.push(service.merchantEmployee.mEmployeeId)
                    }
                    else{
                        ehtml = employeehtml[service.merchantEmployee.mEmployeeId]
                    }
                    console.log("TIPS", service.ticketTips)
                    ehtml.total += Number(ehtml.total) + (Number(service.serviceQty)*Number(service.servicePerUnitCost));
                    ehtml.tips += Number(ehtml.tips) +(service.ticketTips.length > 0 ? Number(service.ticketTips[0].dataValues.tipsAmount) : 0);
                    if(service.mProduct.mProductType === 'Product'){
                        ehtml.supplies += Number(ehtml.supplies) + (Number(service.serviceQty)*Number(service.servicePerUnitCost));
                    }

                    ehtml.html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;width:270px'>`;
                    ehtml.html +=`<div style='max-width:20px'>`+service.serviceQty+`</div>`;
                    ehtml.html +=`<div style='max-width:calc(100% - 150px); '>`+service.mProduct.mProductName+`</div>`

                    ehtml.html +=`<div style='max-width:100px;'>$`+(Number(service.serviceQty)*Number(service.servicePerUnitCost)).toFixed(2)+`</div>`
                    ehtml.html +=`</div>`
                    employeehtml[service.merchantEmployee.mEmployeeId] = ehtml; 
                    if(i === ticketdetail.ticketservices.length-1){ 
                        var response = [];
                        Object.keys(employeehtml).forEach((emp, k)=>{
                            var e = employeehtml[emp]
                            e.html+=`<div style='display:flex;width:270px;align-items:baseline; justify-content:space-between;'><p style='font-size:15px;font-weight:bold;'> Amount</p><p style='font-size:15px;font-weight:bold;'> $`+Number(e.total).toFixed(2)+`</p></div>`

                            e.html +=`<div style='display:flex;width:270px;align-items:baseline; justify-content:space-between;'><p style='font-size:15px;font-weight:bold;'> Supplies</p><p style='font-size:15px;font-weight:bold;'> $`+Number(e.supplies).toFixed(2)+`</p></div>`;

                            e.html += `<div style='display:flex;width:270px;align-items:baseline; justify-content:space-between;'><p style='font-size:15px;font-weight:bold;'> Tip</p><p style='font-size:15px;font-weight:bold;'> $`+Number(e.tips).toFixed(2)+`</p></div>` 

                            e.html+=`<div style='display:flex;align-items:center;justify-content:space-between; width:270px;'><p style=' width:270px;display:flex;align-items:center;justify-content:center;'>`+req.deviceDetails.merchantName+`- Printed `+moment.utc(this.getDate()).local().format('MM/DD/YYYY hh:mm a')+`</p></div>`
                            e.html+=`</div>` // div2
                            e.html+=`</div>`;// div1

                            response.push(e.html)
                            if(k === Object.keys(employeehtml).length-1){
                                this.sendResponse({htmlMsg: response, printers: printer}, res, 200);
                            }
                        })
                    }
                })
            }
        })
    }


    formatCardNumber(cardnumber){
        return cardnumber.substring(0,4)+"-"+cardnumber.substring(3,7)+"-"+cardnumber.substring(7,11)+"-"+cardnumber.substring(11,15)
    }

    getGiftcardPrintHTML = async(req, res, next)=>{
        var input = req.input 
        var cardnumber = input.cardNumber  

        this.readOne({where:{'cardNumber': cardnumber}}, 'giftCards').then(async (results)=>{
            var billprinters = await this.readOne({where:{BillPrint: 1}}, 'printers')
            var printer = billprinters != null ? billprinters.dataValues : {} 
            var merchantdetail = req.deviceDetails;
             //console.log("ticketdetail")
            //console.log(ticketdetail)
            var html = `<div style="max-width:270px;display:inline;font-family:'Arial'" >`; // div1
            html+=`<div style='display:flex;align-items:center;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>`+printer.Title+`</p></div>`
            
            html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
            html += `<div>`+merchantdetail.merchantAddress1+`</div>`
            html += `<div>`+merchantdetail.merchantAddress2+`</div>`
            html += `<div>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipcode+`</div>`
            html+=`</div>`
            html+=`<div style='display:flex;align-items:center;margin:1rem 0 0.5rem;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>Gift Card</p></div>`
            html+=`<div style='display:flex;align-items:center;margin:1rem 0 0.5rem;justify-content:center;'><p style='font-size:14px;font-weight:bold;'>`+this.formatCardNumber(cardnumber)+`</p></div>`
            
            
            html+=`<div style='width:100%; ><p style='margin-bottom:0'>Enjoy</p>
            <p style='margin-top:0'>`+printer.footerText+`</p>
            </div>`

            html+=`</div>` // div2
            html+=`</div>`;// div1
            this.sendResponse({htmlMsg: html, printers: printer}, res, 200);
        
        })
    }


    getTransactionPrintHTML  = async(req, res, next)=>{
        var input = req.input  

        let options = {
            include:[ 
                {
                    model: this.models.merchantEmployees,
                    required: false
                },  
            ],
            where:{ 
                id: input.id
            }, 
        }

        this.readOne(options, 'ticketpayment').then(async (results)=>{
            var billprinters = await this.readOne({where:{BillPrint: 1}}, 'printers')
            var printer = billprinters != null ? billprinters.dataValues : {} 
            var merchantdetail = req.deviceDetails;
            var transaction = results.dataValues||results;  
            var html = `<div style="max-width:100%;display:inline;font-family:'Arial'" >`; // div1
            html+=`<div style='display:flex;align-items:center;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>`+printer.Title+`</p></div>`
            
            html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
            html += `<div>`+merchantdetail.merchantAddress1+`</div>`
            html += `<div>`+merchantdetail.merchantAddress2+`</div>`
            html += `<div>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipcode+`</div>`
            html+=`</div>` 

            html+=`<div><p style='margin-bottom:0;width:100%;display:flex;alignItems:flex-start;justifyContent:flex-start;'>Cashier: `+transaction.merchantEmployee.mEmployeeFirstName+` `+transaction.merchantEmployee.mEmployeeLastName+`</p>
            <p style='margin-top:0;width:100%;display:flex;alignItems:flex-start;justifyContent:flex-start;'>`+moment.utc(transaction.createdDate.replace("T"," ").replace("Z","")).local().format('DD-MMM-YYYY hh:mm a')+`</p>
            </div>` 
            html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;width:100%'>`; 
            html +=`<div style='max-width:calc(100% - 150px);width:calc(100% - 150px);text-transform:capitalize;display:flex;align-items:flex-start; '>`+transaction.payMode+`&nbsp;&nbsp;`+(transaction.payMode.toLowerCase() !== 'cash' ? "("+transaction.paymentType+")" : "")+`</div>`

            html +=`<div style='max-width:150px;width:100px;text-align:right;padding-right:10px;'>$`+Number(transaction.ticketPayment).toFixed(2)+`</div>`
            html +=`</div>` 
            html+=`<div style='width:100%; ><p style='margin-bottom:0'>Enjoy</p>
            <p style='margin-top:0'>`+printer.footerText+`</p>
            </div>`

            html+=`</div>` // div2
            html+=`</div>`;// div1
            this.sendResponse({htmlMsg: html, printers: printer}, res, 200);

        })
    }



    getBatchPrintHTML  = async(req, res, next)=>{
        var input = req.input  

        var bdetail = await this.readOne({where:{batchId:input.id}}, 'batches')
        var batchdetail = bdetail.dataValues || bdetail;
console.log("BATCH DETAIL", batchdetail)
        let options = {
            include:[ 
                {
                    model: this.models.merchantEmployees,
                    required: false
                },  
            ],
            attributes:{
                include:[
                    [
                        sequelize.literal("(select tipsAmount from tickets where ticketId=`ticketpayment`.`ticketId`)"),
                        'Tips'
                    ], 
                ]
            },
            where:{ 
                payMode:'card',
                ticketId: sequelize.literal("(select ticketId from tickets where batchId='"+input.id+"')")
            }, 
        }

        this.readAll(options, 'ticketpayment').then(async (results)=>{
            var billprinters = await this.readOne({where:{BillPrint: 1}}, 'printers')
            var printer = billprinters != null ? billprinters.dataValues : {} 
            var merchantdetail = req.deviceDetails;
            var transactions = results.dataValues||results;  
            var addedCards = [];
            var carddetails = [];
            var addedtickets = [];
            var tipsAmount = 0
            var totalpayment = 0; 
            transactions.forEach((t,i)=>{ 
                console.log(t)
                totalpayment = Number(totalpayment)+Number(t.ticketPayment)
                if(addedtickets.indexOf(t.ticketId) === -1){
                    tipsAmount = Number(tipsAmount) + Number(t.dataValues.Tips)
                }

                if(addedCards.indexOf(t.cardType) === -1){
                    addedCards.push(t.cardType)
                    carddetails.push({
                        card: t.cardType.toUpperCase(),
                        total: t.ticketPayment,
                        count : 1
                    })
                }
                else{
                    var idx = addedCards.indexOf(t.cardType);
                    var totalamt = carddetails[idx].total
                    carddetails[idx].count = Number(carddetails[idx].count)+1
                    carddetails[idx].total = Number(totalamt)+Number(t.ticketPayment); 
                }
                if(i === transactions.length-1){
                    var html = `<div style="max-width:100%;display:inline; font-family:'Arial'" >`; // div1
                    html+=`<div style='display:flex;align-items:center;justify-content:center;'><p style='font-size:12px;font-weight:bold;'>`+printer.Title+`</p></div>`
                    
                    html += `<div style='display:flex;align-items:center;justify-content:center;flex-direction:column'>`
                    html += `<div>`+merchantdetail.merchantAddress1+`</div>`
                    html += `<div>`+merchantdetail.merchantAddress2+`</div>`
                    html += `<div>`+merchantdetail.merchantCity+`,`+merchantdetail.merchantState+`,`+merchantdetail.merchantZipcode+`</div>`
                    html+=`</div>`  

                    html+=`<div><p style='margin-bottom:0;width:100%;display:flex;alignItems:flex-start;justifyContent:flex-start;'>Batch: `+batchdetail.batchName+`</p>
                    <p style='margin-top:0;width:100%;display:flex;alignItems:flex-start;justifyContent:flex-start;'>`+moment.utc(batchdetail.createdDate.replace("T"," ").replace("Z","")).local().format('DD-MMM-YYYY hh:mm a')+`</p>
                    </div>`  
                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:column;width:100%'>`;

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;
                    html +=`<div style='font-size:16px;font-weight:bold;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Type
                    </div>
                    <div style='font-size:16px;font-weight:bold;;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Count
                    </div>
                    <div style='font-size:16px;font-weight:bold;;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Total
                    </div>
                    `
                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;
                    html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Sales
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        `+transactions.length+`
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    $`+Number(totalpayment).toFixed(2)+`
                    </div>
                    `

                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;
                    html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Refund
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        0
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    $0.00
                    </div>
                    `

                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;
                    html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        &nbsp;
                    </div>
                    <div style='font-size:13px;border-top:1px dotted #000;max-width:66.66%;width:66.66%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    &nbsp;
                    </div> 
                    `

                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;
                    html +=`<div style='font-size:13px;font-weight:bold;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Net(Total):
                    </div>
                    <div style='font-size:16px;font-weight:bold;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    `+transactions.length+`
                    </div>
                    <div style='font-size:16px;font-weight:bold;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    $`+Number(totalpayment).toFixed(2)+`
                    </div>
                    `

                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;

                    html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                       Tips:
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    `+addedtickets.length+`
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    $`+Number(tipsAmount).toFixed(2)+`
                    </div>
                    `
                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;

                    html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Voided:
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        0
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    $0.00
                    </div>
                    `
                    html+="</div>";

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;

                    html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        Cash Back:
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        0
                    </div>
                    <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                    $0.00
                    </div>
                    `

                    html+="</div>";

                    html +=`<div style='margin-top:1rem;font-size:16px;font-weight:bold;max-width:100%;width:100%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                            Card Types:
                        </div>
                    ` 

                    carddetails.forEach((cd, ci)=>{ 

                    html+=`<div style='display:flex;align-items:baseline;justify-content:space-between;flex-direction:row;width:100%'>`;
                    
                        html +=`<div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                            `+cd.card+`
                        </div>
                        <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        `+cd.count+`
                        </div>
                        <div style='font-size:13px;max-width:33.33%;width:33.33%;text-transform:capitalize;display:flex;align-items:flex-start; '>
                        $`+Number(cd.total).toFixed(2)+`
                        </div>
                        `
                        html+="</div>"
                    })
  
                    html+=`</div>`;// div1
                    this.sendResponse({htmlMsg: html, printers: printer}, res, 200); 
                    
                }
            })
        })
    }



    getDevices = async(req, res, next)=>{
        var thisobj = this;
        find().then(devices => {
            console.log(devices)
            thisobj.sendResponse({data: devices}, res, 200) /*
            [
              { name: '?', ip: '192.168.0.10', mac: '...' },
              { name: '...', ip: '192.168.0.17', mac: '...' },
              { name: '...', ip: '192.168.0.21', mac: '...' },
              { name: '...', ip: '192.168.0.22', mac: '...' }
            ]
            */
          }).catch(e=>{
            thisobj.sendResponse({message:"Error"}, res, 400)
          })
    }
}
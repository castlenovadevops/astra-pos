// /* eslint-disable no-useless-constructor */
// const baseController = require('../common/baseController');
// const MsgController = require('../common/msgController');
 
// const Sequelize = require('sequelize')
// const sequelize =  require('../../models').sequelize
// module.exports = class WaitinglistController extends baseController{
//     path = "/merchant/WaitingList"; 
//     msgController = new MsgController(); 
//     routes = [];
//     constructor(props){
//         super(props);
//     }

//     initialize(){ 
//         return new Promise((resolve) => {

//             this.routes = [ 
//                 {
//                     path:this.path+"/getAppointmentsList",
//                     type:"post",
//                     method: "getAppointmentsList",
//                     authorization:"authorizationAuth"
//                 },
//                 {
//                     path:this.path+"/convertTicket",
//                     type:"post",
//                     method: "convertTicket",
//                     authorization:"authorizationAuth"
//                 }  
//             ] 
//             resolve({MSG: "INITIALIZED SUCCESSFULLY"})
//         });
//     } 
     

//     getAppointmentsList = async(req,res, next)=>{
//         this.update(`appointments`,{appointmentStatus:'Waiting'}, {where:{
//             appointmentDate:this.getDate().substring(0,10),
//             appointmentStatus:'Booked'
//         }}).then(r=>{
//             this.readAll({
//                 where:{
//                     appointmentStatus:'Waiting',
//                     appointmentDate:this.getDate().substring(0,10),
//                     // id:{
//                     //     [Sequelize.Op.in]:sequelize.literal("(select id from appointments where (parentId is null or parentId='') appointmentTime > '"+req.input.currenttime+"')")
//                     // }
//                 },
//                 include:[
//                     {
//                         model:this.models.appointmentServices,
//                         required: false,
//                         include:[
//                             {
//                                 model:this.models.mProducts,
//                                 required: false,
//                                 include:[
//                                     {
//                                         model:this.models.mProductTax,
//                                         where:{
//                                             status:1
//                                         },
//                                         required:false
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 ],
//                 attributes:{
//                     include:[
//                         [
//                             sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
//                             "customerName"
//                         ]
//                     ]
//                 }
//             }, `appointments`).then(apps=>{
//                 this.sendResponse({data: apps}, res, 200)
//             })
//         })
//     }

//     convertTicket = async(req, res, next)=>{ 
//         let options = {
//             where:{
//                 ticketId:{
//                     [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) = Date('"+new Date().toISOString()+"')  and isDraft=0 and ticketType != 'GiftCard')")
//                 }
//             },
//             order:[
//                 ["ticketCode", "desc"]
//             ]
//         }
//         this.readAll(options, 'tickets').then(rows=>{
//             if(rows.length > 0){
//                 // console.log(rows[0].ticketCode)
//                 var ticketcode = rows[0].ticketCode !== '' && rows[0].ticketCode !== undefined &&rows[0].ticketCode!==null ? rows[0].ticketCode : 0;
//                 var count = Number(ticketcode)+1; 
//                 let ticketcode1 =  String(count).padStart(4, '0')  
//                 this.createTicket(req, res, next, ticketcode1)
//               }
//               else{
//                 let count = 1;
//                 let ticketcode =  String(count).padStart(4, '0') 
//                 this.createTicket(req, res, next, ticketcode)
//               }
//         })
        
//     }

//     createTicket = async(req, res, next,ticketcode)=>{ 
//         var input = {
//             ticketCode: ticketcode,
//             customerId: req.input.appointment.customerId,
//             isDraft: 0, 
//             ownerTechnician:req.input.appointment.appointmentBookedBy,
//             merchantId: req.deviceDetails.merchantId,
//             POSId: req.deviceDetails.device.POSId,
//             createdBy: req.userData.mEmployeeId,
//             createdDate: this.getDate(),
//             paymentStatus:'Pending'
//         }
//         this.create('tickets', input).then(ticket=>{
//             this.saveTicketServices(req, res, next,ticket.dataValues, 0)
//         })
//     }

//     saveTicketServices = async(req, res, next,ticketDetail, idx=0)=>{
//         if(idx<req.input.appointment.appointmentServices.length){
//             var service = req.input.appointment.appointmentServices[idx]; 
//             var serviceinput = {
//                 "ticketId" : ticketDetail.ticketId,
//                 "serviceId"	: service.mProduct.mProductId,
//                 "serviceTechnicianId" : service.technicianId,
//                 "serviceQty": 1,
//                 "serviceOriginalPrice": service.mProduct.mProductPrice,
//                 "servicePrice": service.mProduct.mProductPrice,
//                 "servicePerUnitCost": service.mProduct.mProductPrice,
//                 "serviceNotes":'',
//                 "splitFrom":'',
//                 "transferredFrom":'',
//                 "combinedFrom":'',
//                 "createdBy": req.userData.mEmployeeId,
//                 "createdDate": this.getDate(),
//                 "isSpecialRequest" : 0
//             }
//             console.log("SERVICE INPUT::::::",service, serviceinput) 
//                 this.create('ticketservices', serviceinput, true).then(r=>{ 
//                     console.log(r)
//                     var ticketServiceId = r.dataValues.ticketServiceId || r.ticketServiceId 
//                         this.saveTicketServiceTax(req,res,next,ticketServiceId,idx,0, ticketDetail) 
//                 }) 
//         }
//         else{ 
//             this.update('appointments', {appointmentStatus:'ModifiedTicket', ticketId: ticketDetail.ticketId}, {where:{id:req.input.appointment.id}}).then(r=>{
//                 this.readOne({where:{ticketId: ticketDetail.ticketId}, 
//                 include:[
//                     {
//                         model: this.models.mCustomers,
//                         required: false,
//                         attributes:{
//                             include:[  
//                                 [
//                                     sequelize.literal("(select   SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
//                                     // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId`)"),
//                                     "LoyaltyPoints"
//                                 ]
//                             ]
//                         }
//                     },
//                     {
//                         model: this.models.merchantEmployees,
//                         required: false
//                     }, 
//                     {
//                         model: this.models.ticketdiscount,
//                         required: false,
//                         where:{
//                             status:1
//                         }
//                     }, 
//                 ]}, 'tickets').then(tdetail=>{ 
//                     this.sendResponse({data: tdetail.dataValues || tdetail}, res, 200)
//                 })
//             })
//         }
//     }

//     saveTicketServiceTax= async (req,res,next,ticketServiceId,idx,tid,ticketDetail)=>{
//         var service = req.input.appointment.appointmentServices[idx]; 
//         if(tid < service.mProduct.mProductTaxes.length){
//             var input = service.mProduct.mProductTaxes[tid];
//             var taxinput = {
//                 ticketServiceId: ticketServiceId,
//                 mTaxId: input.mTaxId,
//                 mTaxName: input.mTaxName,
//                 mTaxType: input.mTaxType,
//                 mTaxValue: input.mTaxValue,
//                 mTaxAmount: input.mTaxAmount,
//                 status:1,
//                 createdBy: req.userData.mEmployeeId,
//                 createdDate: this.getDate(),
//             } 
//             this.create('ticketservicetax', taxinput, true).then(r=>{ 
//                 this.saveTicketServiceTax(req, res, next, ticketServiceId, idx, tid+1,ticketDetail)
//             }).catch(e=>{
//                 console.log("ERROR", e)
//             })
//         }
//         else{ 
//             this.saveTicketServices(req,res, next, ticketDetail, idx+1)
//         }
//     }
// }


/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class WaitinglistController extends baseController{
    path = "/merchant/WaitingList"; 
    msgController = new MsgController(); 
    routes = [];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [ 
                {
                    path:this.path+"/getAppointmentsList",
                    type:"post",
                    method: "getAppointmentsList",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/convertTicket",
                    type:"post",
                    method: "convertTicket",
                    authorization:"authorizationAuth"
                }  
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
     

    getAppointmentsList = async(req,res, next)=>{
        this.update(`appointments`,{appointmentStatus:'Waiting'}, {where:{
            appointmentDate:this.getDate().substring(0,10),
            appointmentStatus:'Booked'
        }}).then(r=>{
            this.readAll({
                where:{
                    appointmentStatus:'Waiting',
                    appointmentDate:this.getDate().substring(0,10),
                    id:{
                        [Sequelize.Op.in]:sequelize.literal("(select id from appointments where (parentId is null or parentId='') and appointmentTime > '"+req.input.currenttime+"')")
                    }
                },
                include:[
                    {
                        model:this.models.appointmentServices,
                        required: false,
                        include:[
                            {
                                model:this.models.mProducts,
                                required: false,
                                where:{
                                    mProductStatus:1
                                },
                                include:[
                                    {
                                        model:this.models.mProductTax,
                                        attributes:{
                                            include:[
                                                [
                                                    sequelize.literal("(select mTaxName from mTax where mTaxId=`appointmentServices->mProduct->mProductTaxes`.`mTaxId`)"),
                                                    "mTaxName"
                                                ], 
                                                [
                                                    sequelize.literal("(select mTaxType from mTax where mTaxId=`appointmentServices->mProduct->mProductTaxes`.`mTaxId`)"),
                                                    "mTaxType"
                                                ],
                                                [
                                                    sequelize.literal("(select mTaxValue from mTax where mTaxId=`appointmentServices->mProduct->mProductTaxes`.`mTaxId`)"),
                                                    "mTaxValue"
                                                ]
                                            ]
                                        },
                                        // where:{
                                        //     status:1,
                                        //     mTaxId:{
                                        //         [Sequelize.Op.in]: sequelize.literal("(select mTaxId from mTax where mTaxStatus=1)")
                                        //     }
                                        // },
                                        required:false
                                    }
                                ]
                            }
                        ]
                    }
                ],
                attributes:{
                    include:[
                        [
                            sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
                            "customerName"
                        ]
                    ]
                }
            }, `appointments`).then(apps=>{
                console.log(apps)
                this.sendResponse({data: apps}, res, 200)
            })
        })
    }

    convertTicket = async(req, res, next)=>{ 
        let options = {
            where:{
                ticketId:{
                    [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) = Date('"+new Date().toISOString()+"')  and isDraft=0 and ticketType != 'GiftCard')")
                }
            },
            order:[
                ["ticketCode", "desc"]
            ]
        }
        this.readAll(options, 'tickets').then(rows=>{
            if(rows.length > 0){
                // console.log(rows[0].ticketCode)
                var ticketcode = rows[0].ticketCode !== '' && rows[0].ticketCode !== undefined &&rows[0].ticketCode!==null ? rows[0].ticketCode : 0;
                var count = Number(ticketcode)+1; 
                let ticketcode1 =  String(count).padStart(4, '0')  
                this.createTicket(req, res, next, ticketcode1)
              }
              else{
                let count = 1;
                let ticketcode =  String(count).padStart(4, '0') 
                this.createTicket(req, res, next, ticketcode)
              }
        })
        
    }

    createTicket = async(req, res, next,ticketcode)=>{ 
        var input = {
            ticketCode: ticketcode,
            customerId: req.input.appointment.customerId,
            isDraft: 1, 
            ownerTechnician:req.input.appointment.appointmentBookedBy,
            merchantId: req.deviceDetails.merchantId,
            POSId: req.deviceDetails.device.POSId,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
            paymentStatus:'Pending'
        }
        var appointmentServices = await this.readAll({
            where:{
                appointmentId:{
                    [Sequelize.Op.in]:sequelize.literal("(select appointmentId from appointments where appointmentId='"+req.input.appointment.appointmentId+"' or parentId='"+req.input.appointment.appointmentId+"')")
                }
            },
            include:[
                {
                    model:this.models.mProducts,
                    required: false,
                    include:[
                        {
                            model:this.models.mProductTax,
                            where:{
                                status:1
                            },
                            required:false,
                            include:[
                                {
                                    model:this.models.mTax,
                                    required:false,
                                }
                            ]
                        }
                    ]
                }
            ]
        }, 'appointmentServices')
console.log("services length ", appointmentServices.length)
        this.create('tickets', input).then(ticket=>{

            this.saveTicketServices(req, res, next,ticket.dataValues, appointmentServices, 0)
        })
    }

    saveTicketServices = async(req, res, next,ticketDetail, appointmentServices, idx=0)=>{
        console.log("APPT SERVICE", appointmentServices.length, idx)
        if(idx<appointmentServices.length){
            var service = appointmentServices[idx].dataValues || appointmentServices[idx]; 
            
            var serviceinput = {
                "ticketId" : ticketDetail.ticketId,
                "serviceId"	: service.mProduct.mProductId,
                "serviceTechnicianId" : service.technicianId,
                "serviceQty": 1,
                "serviceOriginalPrice": service.mProduct.mProductPrice,
                "servicePrice": service.mProduct.mProductPrice,
                "servicePerUnitCost": service.mProduct.mProductPrice,
                "serviceNotes":'',
                "splitFrom":'',
                "transferredFrom":'',
                "combinedFrom":'',
                "createdBy": req.userData.mEmployeeId,
                "createdDate": this.getDate(),
                "isSpecialRequest" : 0
            }
            console.log("SERVICE INPUT::::::",service, serviceinput) 
                this.create('ticketservices', serviceinput, true).then(r=>{ 
                    console.log(r)
                    var ticketServiceId = r.dataValues.ticketServiceId || r.ticketServiceId 
                        this.saveTicketServiceTax(req,res,next,ticketServiceId,appointmentServices, idx,0, ticketDetail) 
                }) 
        }
        else{ 
            this.update('appointments', { ticketId: ticketDetail.ticketId}, {where:{id:req.input.appointment.id}}).then(r=>{
                this.readOne({where:{ticketId: ticketDetail.ticketId}, 
                include:[
                    {
                        model: this.models.mCustomers,
                        required: false,
                        attributes:{
                            include:[  
                                [
                                    sequelize.literal("(select   SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                                    // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId`)"),
                                    "LoyaltyPoints"
                                ]
                            ]
                        }
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
                ]}, 'tickets').then(tdetail=>{ 
                    this.sendResponse({data: tdetail.dataValues || tdetail}, res, 200)
                })
            })
        }
    }

    saveTicketServiceTax= async (req,res,next,ticketServiceId,appointmentServices, idx,tid,ticketDetail)=>{
        var service = appointmentServices[idx].dataValues || appointmentServices[idx]; 
        if(service.mProduct.mProductTaxType === 'Default'){
            service.mProduct.mProductTaxes = await this.readAll({where:{ mTaxStatus:{
                [Sequelize.Op.ne]:2
            },
            isDefault:1}}, 'mTax') 
            if(tid < service.mProduct.mProductTaxes.length){
                var input = service.mProduct.mProductTaxes[tid].dataValues || service.mProduct.mProductTaxes[tid];
                console.log("SERVICE TAX", input)
                var taxinput = {
                    ticketServiceId: ticketServiceId,
                    mTaxId: input.mTaxId,
                    mTaxName: input.mTaxName,
                    mTaxType: input.mTaxType,
                    mTaxValue: input.mTaxValue,
                    mTaxAmount: 0,//input.mTaxAmount,
                    status:1,
                    createdBy: req.userData.mEmployeeId,
                    createdDate: this.getDate(),
                } 
                this.create('ticketservicetax', taxinput, true).then(r=>{ 
                    this.saveTicketServiceTax(req, res, next, ticketServiceId, appointmentServices, idx, tid+1,ticketDetail)
                }).catch(e=>{
                    console.log("ERROR", e)
                })
            }
            else{ 
                this.saveTicketServices(req,res, next, ticketDetail, appointmentServices, idx+1)
            }
        }
        else{
            if(tid < service.mProduct.mProductTaxes.length){
                var input = service.mProduct.mProductTaxes[tid].mTax.dataValues || service.mProduct.mProductTaxes[tid].mTax;
                console.log("SERVICE TAX", input)
                var taxinput = {
                    ticketServiceId: ticketServiceId,
                    mTaxId: input.mTaxId,
                    mTaxName: input.mTaxName,
                    mTaxType: input.mTaxType,
                    mTaxValue: input.mTaxValue,
                    mTaxAmount: 0,//input.mTaxAmount,
                    status:1,
                    createdBy: req.userData.mEmployeeId,
                    createdDate: this.getDate(),
                } 
                this.create('ticketservicetax', taxinput, true).then(r=>{ 
                    this.saveTicketServiceTax(req, res, next, ticketServiceId, appointmentServices, idx, tid+1,ticketDetail)
                }).catch(e=>{
                    console.log("ERROR", e)
                })
            }
            else{ 
                this.saveTicketServices(req,res, next, ticketDetail, appointmentServices, idx+1)
            }
        }
    }
}
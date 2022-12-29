// /* eslint-disable no-useless-constructor */
// const baseController = require('../common/baseController');
// const MsgController = require('../common/msgController');
 
// const Sequelize = require('sequelize')
// const sequelize =  require('../../models').sequelize
// module.exports = class AppointmentController extends baseController{
//     path = "/merchant/appointment"; 
//     msgController = new MsgController(); 
//     routes = [];
//     constructor(props){
//         super(props);
//     }

//     initialize(){ 
//         return new Promise((resolve) => {

//             this.routes = [
//                 {
//                     path:this.path+"/save",
//                     type:"post",
//                     method: "saveAppointment",
//                     authorization:"authorizationAuth"
//                 }, 
//                 {
//                     path:this.path+"/getAllAppointmentsByDate",
//                     type:"post",
//                     method: "getAllAppointmentsByDate",
//                     authorization:"authorizationAuth"
//                 },
//                 {
//                     path:this.path+"/getAppointmentDetail",
//                     type:"post",
//                     method: "getAppointmentDetail",
//                     authorization:"authorizationAuth"
//                 }, 
//                 {
//                     path:this.path+"/delete",
//                     type:"post",
//                     method: "deleteAppointment",
//                     authorization:"authorizationAuth"
//                 }, 
                
//                 {
//                     path:this.path+"/getAppointmentsByDate",
//                     type:"post",
//                     method: "getAppointmentsByDate",
//                     authorization:"authorizationAuth"
//                 },
//                 {
//                     path:this.path+"/getAppointmentsList",
//                     type:"post",
//                     method: "getAppointmentsList",
//                     authorization:"authorizationAuth"
//                 }
                
//             ] 
//             resolve({MSG: "INITIALIZED SUCCESSFULLY"})
//         });
//     } 
    

//     saveAppointment = async(req, res, next)=>{
//         console.log("APPOT ID", req.input.data.appointmentId )
//         if(req.input.data.appointmentId !== undefined && req.input.data.appointmentId !== ''){  
//             this.update('appointments',{appointmentStatus:'Deleted'}, {where:{
//                 [Sequelize.Op.or]:[
//                     {appointmentId: req.input.data.appointmentId},
//                     {parentId: req.input.data.appointmentId}
//                 ]
//             }}).then(r=>{
//                 this.saveAppointments(0, req, res, next)
//             })
//         }
//         else{
//             this.saveAppointments(0, req, res, next)
//         }
//     }

//     saveAppointments = async(i,req,res,next, parentappid='')=>{
//         var keys =  req.input.data.appointments
//         if(i < keys.length){
//             var obj = keys[i]
//             console.log(obj)
//             var appinput = {
//                 appointmentBookedBy: req.userData.mEmployeeId,
//                 createdDate: this.getDate(),
//                 appointmentDate:req.input.data.appointmentdate,
//                 appointmentTime:req.input.data.appointmenttime,
//                 recordType:'Appointment'
//             }
            
//             if(i === 0){
//                 appinput["customerId"] = obj.customer.mCustomerId
//                 appinput["parentId"] = ''
//                 appinput["appointmentStatus"] = 'Booked'
//             }
//             else{ 
//                 appinput["guestName"] = obj.customer !== null?  obj.customer.mCustomerName : ''
//                 appinput["customerId"] = obj.customer !== null?   obj.customer.mCustomerId : ''
//                 appinput["parentId"] = parentappid
//                 appinput["appointmentStatus"] = 'Booked'
//             }

//             this.create('appointments', appinput).then(async (r)=>{
//                 if(i === 0){ 
//                     parentappid = r.dataValues.appointmentId || r.appointmentId
//                 }
//                 var appointmentid = r.dataValues.appointmentId || r.appointmentId
//                 this.saveAppointmentIndividualServices(0,obj.services, i, req,res, next, parentappid, appointmentid)
//             })

//         }

//         else{
//             this.sendResponse({message:"Appointment saved successfully."}, res, 200)
//         }
//     }

//     // saveAppointmentServices = async(i, req, res, next, parentappid='')=>{
//     //     console.log(Object.keys(req.input.data.selectedServices), i)
//     //     var keys = Object.keys(req.input.data.selectedServices)
//     //     if(i < keys.length){
//     //         var obj = keys[i]
//     //         console.log(obj)
//     //         if(obj !== '' && obj !== undefined){
//     //             var appinput = {
//     //                 appointmentBookedBy: req.userData.mEmployeeId,
//     //                 createdDate: this.getDate(),
//     //                 appointmentDate:req.input.data.showingCustomerForm.appointmentdate,
//     //                 appointmentTime:req.input.data.showingCustomerForm.appointmenttime,
//     //                 recordType:'Appointment'
//     //             }
            
//     //             if(obj.indexOf('Guest') === -1){
//     //                 appinput["customerId"] = req.input.data.showingCustomerForm.customerDetail.mCustomerId
//     //                 appinput["parentId"] = ''
//     //                 appinput["appointmentStatus"] = 'Booked'
//     //             }
//     //             else{ 
//     //                 appinput["guestName"] = obj
//     //                 appinput["parentId"] = parentappid
//     //                 appinput["appointmentStatus"] = 'Booked'
//     //             }

//     //             this.create('appointments', appinput).then(async (r)=>{
//     //                 if(obj.indexOf('Guest') === -1){ 
//     //                     parentappid = r.dataValues.appointmentId || r.appointmentId
//     //                 }
//     //                 var appointmentid = r.dataValues.appointmentId || r.appointmentId
//     //                 this.saveAppointmentIndividualServices(0,req.input.data.selectedServices[obj], i, req,res, next, parentappid, appointmentid)
//     //             })
//     //         }
//     //         else{
//     //             this.sendResponse({message:"Appointment saved successfully."}, res, 200)
//     //         }
//     //     }

//     //     else{
//     //         this.sendResponse({message:"Appointment saved successfully."}, res, 200)
//     //     }
//     // }

//     saveAppointmentIndividualServices = async(j, services, i, req,res, next, parentappid, appointmentid)=>{
//         console.log("SERVICEs ", services, j)
//         if(j < services.length){
//             var input = {
//                 appointmentId: appointmentid,
//                 serviceId: services[j].service,
//                 technicianId: services[j].technician,
//                 serviceDuration: services[j].duration
//             }

//             this.create('appointmentServices', input).then(r=>{
//                 this.saveAppointmentIndividualServices(j+1,services, i, req,res, next, parentappid, appointmentid)
//             })
//         }
//         else{
//             // this.saveAppointmentServices(i+1, req, res, next, parentappid)
//             this.saveAppointments(i+1, req, res, next, parentappid)
//         }
//     }

//     getAllAppointmentsByDate = async(req, res, next)=>{ 
//         this.readAll({ 
//             where:{
//                 parentId:{
//                     [Sequelize.Op.in]:[null, '']
//                 },
//                 appointmentStatus:{
//                     [Sequelize.Op.in]:[ 'Booked']
//                 }
//             },
//             attributes:{
//                 include:[

//                     [
//                         Sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
//                         "title"
//                     ] 
//                 ]
//             }   
//         }, `appointments`).then(apps=>{
//             this.sendResponse({data: apps}, res, 200)
//         })
//     }

//     getAppointmentsByDate = async(req, res, next)=>{ 
//         this.readAll({
//             group: [
//                 ['appointmentDate'] 
//             ],
//             where:{
//                 parentId:{
//                     [Sequelize.Op.in]:[null, '']
//                 }
//             },
//             attributes:[
//                 [Sequelize.col("`appointmentDate`"), 'appointmentDate'],
//                 [Sequelize.col("`appointmentDate`"), 'dateFrom'],
//                 [Sequelize.col("`appointmentDate`"), 'dateTo'],
//                 [Sequelize.fn('count', Sequelize.col('appointmentId')), 'name'],
//                 [Sequelize.literal("'Holiday'"), 'type']
//             ]
//         }, `appointments`).then(apps=>{
//             this.sendResponse({data: apps}, res, 200)
//         })
//     }

//     getAppointmentsList = async(req,res, next)=>{
//         this.readAll({
//             where:{
//                 appointmentDate:req.input.date.substring(0,10),
//                 parentId:{
//                     [Sequelize.Op.in]:[null, '']
//                 }
//                 // {
//                 //     [Sequelize.Op.like]: req.input.date.substring(0,10)+'%'
//                 // }
//             },
//             attributes:{
//                 include:[
//                     [
//                         sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
//                         "customerName"
//                     ]
//                 ]
//             }
//         }, `appointments`).then(apps=>{
//             this.sendResponse({data: apps}, res, 200)
//         })
//     }

//     getAppointmentDetail = async(req, res, next)=>{
//         var id = req.input.id;

//         let appointments = await this.readAll({
//             where:{
//                 [Sequelize.Op.or]:[
//                     {appointmentId: id},
//                     {parentId: id}
//                 ]
//             },
//             include:[
//                 {
//                     model: this.models.mCustomers,
//                     required : false,
//                     attributes:{
//                         include: [ 
//                             [
//                                 Sequelize.col('mCustomerId'),
//                                 `id`
//                             ], 
//                             [
//                                 sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
//                                 // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
//                                 "mCustomerLoyaltyPoints"
//                             ] , 
//                             [
//                                 sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
//                                 // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
//                                 "LoyaltyPoints"
//                             ]
//                         ]
//                     }
//                 },
//                 {
//                     model: this.models.appointmentServices,
//                     required: false,
//                     // include:[
//                     //     {
//                     //         model:this.models.mProducts,
//                     //         required:false,
//                     //         include:[
//                     //             {
//                     //                 model:this.models.mProductCategory, 
//                     //                 where:{
//                     //                     status:1, 
//                     //                 },
//                     //                 required: false
//                     //             },
//                     //             {
//                     //                 model:this.models.mProductTax, 
//                     //                 where:{
//                     //                     status:1
//                     //                 },
//                     //                 required: false
//                     //             }
//                     //         ]
//                     //     },
//                     //     {
//                     //         model:this.models.merchantEmployees,
//                     //         required:false,
//                     //         include:[
//                     //             {
//                     //                 model: this.models.mEmployeeCommission,
//                     //                 required: false
//                     //             }
//                     //         ]
//                     //     }
//                     // ]
//                 }
//             ]
//         }, 'appointments')
//         this.sendResponse({data: appointments}, res, 200)
//     }


//     deleteAppointment = async(req, res, next)=>{
//         var id = req.input.id
//         this.delete('appointments', {appointmentId: id}).then(r=>{
//             this.sendResponse({message:"Appointment deleted."}, res, 200);
//         })
//     }
// }


/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
const Sequelize = require('sequelize')
const sequelize =  require('../../models').sequelize
module.exports = class AppointmentController extends baseController{
    path = "/merchant/appointment"; 
    msgController = new MsgController(); 
    routes = [];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {

            this.routes = [
                {
                    path:this.path+"/save",
                    type:"post",
                    method: "saveAppointment",
                    authorization:"authorizationAuth"
                }, 
                {
                    path:this.path+"/getAllAppointmentsByDate",
                    type:"post",
                    method: "getAllAppointmentsByDate",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/getAppointmentDetail",
                    type:"post",
                    method: "getAppointmentDetail",
                    authorization:"authorizationAuth"
                }, 
                {
                    path:this.path+"/delete",
                    type:"post",
                    method: "deleteAppointment",
                    authorization:"authorizationAuth"
                }, 
                
                {
                    path:this.path+"/getAppointmentsByDate",
                    type:"post",
                    method: "getAppointmentsByDate",
                    authorization:"authorizationAuth"
                },
                {
                    path:this.path+"/getAppointmentsList",
                    type:"post",
                    method: "getAppointmentsList",
                    authorization:"authorizationAuth"
                }
                
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    

    saveAppointment = async(req, res, next)=>{
        console.log("APPOT ID", req.input.data.appointmentId )
        if(req.input.data.appointmentId !== undefined && req.input.data.appointmentId !== ''){  
            this.update('appointments',{appointmentStatus:'Deleted'}, {where:{
                [Sequelize.Op.or]:[
                    {appointmentId: req.input.data.appointmentId},
                    {parentId: req.input.data.appointmentId}
                ]
            }}).then(r=>{
                this.saveAppointments(0, req, res, next)
            })
        }
        else{
            this.saveAppointments(0, req, res, next)
        }
    }

    saveAppointments = async(i,req,res,next, parentappid='')=>{
        var keys =  req.input.data.appointments
        if(i < keys.length){
            var obj = keys[i]
            console.log(obj)
            var appinput = {
                appointmentBookedBy: req.userData.mEmployeeId,
                createdDate: this.getDate(),
                appointmentDate:req.input.data.appointmentdate,
                appointmentTime:req.input.data.appointmenttime,
                recordType:'Appointment'
            }
            
            if(i === 0){
                appinput["customerId"] = obj.customer.mCustomerId
                appinput["parentId"] = ''
                appinput["appointmentStatus"] = 'Booked'
            }
            else{ 
                appinput["guestName"] = obj.customer !== null?  obj.customer.mCustomerName : ''
                appinput["customerId"] = obj.customer !== null?   obj.customer.mCustomerId : ''
                appinput["parentId"] = parentappid
                appinput["appointmentStatus"] = 'Booked'
            }

            this.create('appointments', appinput).then(async (r)=>{
                if(i === 0){ 
                    parentappid = r.dataValues.appointmentId || r.appointmentId
                }
                var appointmentid = r.dataValues.appointmentId || r.appointmentId
                this.saveAppointmentIndividualServices(0,obj.services, i, req,res, next, parentappid, appointmentid)
            })

        }

        else{
            this.sendResponse({message:"Appointment saved successfully."}, res, 200)
        }
    }

    // saveAppointmentServices = async(i, req, res, next, parentappid='')=>{
    //     console.log(Object.keys(req.input.data.selectedServices), i)
    //     var keys = Object.keys(req.input.data.selectedServices)
    //     if(i < keys.length){
    //         var obj = keys[i]
    //         console.log(obj)
    //         if(obj !== '' && obj !== undefined){
    //             var appinput = {
    //                 appointmentBookedBy: req.userData.mEmployeeId,
    //                 createdDate: this.getDate(),
    //                 appointmentDate:req.input.data.showingCustomerForm.appointmentdate,
    //                 appointmentTime:req.input.data.showingCustomerForm.appointmenttime,
    //                 recordType:'Appointment'
    //             }
            
    //             if(obj.indexOf('Guest') === -1){
    //                 appinput["customerId"] = req.input.data.showingCustomerForm.customerDetail.mCustomerId
    //                 appinput["parentId"] = ''
    //                 appinput["appointmentStatus"] = 'Booked'
    //             }
    //             else{ 
    //                 appinput["guestName"] = obj
    //                 appinput["parentId"] = parentappid
    //                 appinput["appointmentStatus"] = 'Booked'
    //             }

    //             this.create('appointments', appinput).then(async (r)=>{
    //                 if(obj.indexOf('Guest') === -1){ 
    //                     parentappid = r.dataValues.appointmentId || r.appointmentId
    //                 }
    //                 var appointmentid = r.dataValues.appointmentId || r.appointmentId
    //                 this.saveAppointmentIndividualServices(0,req.input.data.selectedServices[obj], i, req,res, next, parentappid, appointmentid)
    //             })
    //         }
    //         else{
    //             this.sendResponse({message:"Appointment saved successfully."}, res, 200)
    //         }
    //     }

    //     else{
    //         this.sendResponse({message:"Appointment saved successfully."}, res, 200)
    //     }
    // }

    saveAppointmentIndividualServices = async(j, services, i, req,res, next, parentappid, appointmentid)=>{
        console.log("SERVICEs ", services, j)
        if(j < services.length){
            var input = {
                appointmentId: appointmentid,
                serviceId: services[j].service,
                technicianId: services[j].technician,
                serviceDuration: services[j].duration
            }

            this.create('appointmentServices', input).then(r=>{
                this.saveAppointmentIndividualServices(j+1,services, i, req,res, next, parentappid, appointmentid)
            })
        }
        else{
            // this.saveAppointmentServices(i+1, req, res, next, parentappid)
            this.saveAppointments(i+1, req, res, next, parentappid)
        }
    }

    getAllAppointmentsByDate = async(req, res, next)=>{ 
        this.readAll({ 
            where:{
                parentId:{
                    [Sequelize.Op.in]:[null, '']
                },
                appointmentStatus:{
                    [Sequelize.Op.in]:[ 'Booked']
                }
            },
            attributes:{
                include:[

                    [
                        Sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
                        "title"
                    ] 
                ]
            }   
        }, `appointments`).then(apps=>{
            this.sendResponse({data: apps}, res, 200)
        })
    }

    getAppointmentsByDate = async(req, res, next)=>{ 
        this.readAll({
            group: [
                ['appointmentDate'] 
            ],
            where:{
                parentId:{
                    [Sequelize.Op.in]:[null, '']
                }
            },
            attributes:[
                [Sequelize.col("`appointmentDate`"), 'appointmentDate'],
                [Sequelize.col("`appointmentDate`"), 'dateFrom'],
                [Sequelize.col("`appointmentDate`"), 'dateTo'],
                [Sequelize.fn('count', Sequelize.col('appointmentId')), 'name'],
                [Sequelize.literal("'Holiday'"), 'type']
            ]
        }, `appointments`).then(apps=>{
            this.sendResponse({data: apps}, res, 200)
        })
    }

    getAppointmentsList = async(req,res, next)=>{
        this.readAll({
            where:{
                appointmentDate:req.input.date.substring(0,10),
                parentId:{
                    [Sequelize.Op.in]:[null, '']
                }
                // {
                //     [Sequelize.Op.like]: req.input.date.substring(0,10)+'%'
                // }
            },
            attributes:{
                include:[
                    [
                        sequelize.literal("(select mCustomerName from mCustomers where mCustomerId=`appointments`.`customerId`)"),
                        "customerName"
                    ]
                ]
            }
        }, `appointments`).then(apps=>{
            this.sendResponse({data: apps}, res, 200)
        })
    }

    getAppointmentDetail = async(req, res, next)=>{
        var id = req.input.id;

        let appointments = await this.readAll({
            where:{
                [Sequelize.Op.or]:[
                    {appointmentId: id},
                    {parentId: id}
                ]
            },
            include:[
                {
                    model: this.models.mCustomers,
                    required : false,
                    attributes:{
                        include: [ 
                            [
                                Sequelize.col('mCustomerId'),
                                `id`
                            ], 
                            [
                                sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                                // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
                                "mCustomerLoyaltyPoints"
                            ] , 
                            [
                                sequelize.literal("(select  SUM(Earned)-SUM(Redeemed) FROM ( select pointsCount as Earned, 0 as Redeemed From customerLoyaltyPoints where status='Earned' and customerId=`mCustomer`.`mCustomerId` union all select 0 as Earned, pointsCount as Redeemed From customerLoyaltyPoints where status='Redeemed' and customerId=`mCustomer`.`mCustomerId` ) )"),
                                // sequelize.literal("(select sum(pointsCount) from customerLoyaltyPoints where status='Earned' and customerId=`mCustomers`.`mCustomerId`)"),
                                "LoyaltyPoints"
                            ]
                        ]
                    }
                },
                {
                    model: this.models.appointmentServices,
                    required: false,
                    // include:[
                    //     {
                    //         model:this.models.mProducts,
                    //         required:false,
                    //         include:[
                    //             {
                    //                 model:this.models.mProductCategory, 
                    //                 where:{
                    //                     status:1, 
                    //                 },
                    //                 required: false
                    //             },
                    //             {
                    //                 model:this.models.mProductTax, 
                    //                 where:{
                    //                     status:1
                    //                 },
                    //                 required: false
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         model:this.models.merchantEmployees,
                    //         required:false,
                    //         include:[
                    //             {
                    //                 model: this.models.mEmployeeCommission,
                    //                 required: false
                    //             }
                    //         ]
                    //     }
                    // ]
                }
            ]
        }, 'appointments')
        this.sendResponse({data: appointments}, res, 200)
    }


    deleteAppointment = async(req, res, next)=>{
        var id = req.input.id
        this.delete('appointments', {appointmentId: id}).then(r=>{
            this.sendResponse({message:"Appointment deleted."}, res, 200);
        })
    }
}
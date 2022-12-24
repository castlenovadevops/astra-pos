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
module.exports = class CheckInController extends baseController{
    path = "/pos/checkins";
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
                    path:this.path+"/getDevices",
                    type:"post",
                    method: "getDevices",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/checkPOS",
                    type:"post",
                    method: "checkPOS",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/receiveCheckin",
                    type:"post",
                    method: "receiveCheckin",
                    authorization:'accessAuth'
                },
                {
                    path:this.path+"/saveAppointment",
                    type:"post",
                    method: "saveAppointment",
                    authorization:'accessAuth'
                }
                
            ]
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 


    saveAppointment = async(req, res, next)=>{
        this.saveAppointmentServices(0, req, res, next)
    }

    saveAppointmentServices = async(i, req, res, next, parentappid='')=>{
        console.log(Object.keys(req.input.data.selectedServices), i)
        var keys = Object.keys(req.input.data.selectedServices)
        var owner = await this.readOne({where:{mEmployeeRoleName:'Owner'}}, 'merchantEmployees')
        if(i < keys.length){
            var obj = keys[i]
            console.log(obj)
            if(obj !== '' && obj !== undefined){
                var appinput = {
                    appointmentBookedBy: owner.dataValues.mEmployeeId || owner.mEmployeeId,
                    createdDate: this.getDate(),
                    appointmentDate:req.input.data.showingCustomerForm.appointmentdate,
                    appointmentTime:req.input.data.showingCustomerForm.appointmenttime,
                    recordType:'Appointment'
                }
            
                if(obj.indexOf('Guest') === -1){
                    appinput["customerId"] = req.input.data.showingCustomerForm.customerDetail.mCustomerId
                    appinput["parentId"] = ''
                    appinput["appointmentStatus"] = 'Booked'
                }
                else{ 
                    appinput["guestName"] = obj
                    appinput["parentId"] = parentappid
                    appinput["appointmentStatus"] = 'Booked'
                }

                this.create('appointments', appinput).then(async (r)=>{
                    if(obj.indexOf('Guest') === -1){ 
                        parentappid = r.dataValues.appointmentId || r.appointmentId
                    }
                    var appointmentid = r.dataValues.appointmentId || r.appointmentId
                    this.saveAppointmentIndividualServices(0,req.input.data.selectedServices[obj], i, req,res, next, parentappid, appointmentid)
                })
            }
            else{
                this.sendResponse({message:"Appointment saved successfully."}, res, 200)
            }
        }

        else{
            this.sendResponse({message:"Appointment saved successfully."}, res, 200)
        }
    }

    saveAppointmentIndividualServices = async(j, services, i, req,res, next, parentappid, appointmentid)=>{
        console.log("SERVICEs ", services, j)
        if(j < services.length){
            var input = {
                appointmentId: appointmentid,
                serviceId: services[j].mProductId,
                technicianId: services[j].technicianId,
                serviceDuration: services[j].duration
            }

            this.create('appointmentServices', input).then(r=>{
                this.saveAppointmentIndividualServices(j+1,services, i, req,res, next, parentappid, appointmentid)
            })
        }
        else{
            this.saveAppointmentServices(i+1, req, res, next, parentappid)
        }
    }


    getDevices = async(req, res, next)=>{
        var thisobj = this;
        find().then(devices => {
            console.log(devices)
            thisobj.sendResponse({data: devices}, res, 200)
          }).catch(e=>{
            thisobj.sendResponse({message:"Error"}, res, 400)
          })
    }


    checkPOS = async(req, res, next)=>{  
        console.log("CHECKIN CALLED")
        this.sendResponse({message:"Connection established"}, res, 200)
    }

    receiveCheckin = async(req, res, next)=>{
        var input = req.input;
        console.log("RECEIVED INPUT ", input)
        this.sendResponse({data: input}, res, 200)
    }
}
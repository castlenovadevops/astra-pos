/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController'); 
const express = require('express'); 
const { Sequelize } = require('sequelize/types');

module.exports = class TicketController extends baseController{
    path = "/merchant/ticket";
    router = express.Router();
    msgController = new MsgController();
    routes =[];
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            this.routes = [
                {
                    path:this.path+"/getTicketcode",
                    type:"post",
                    method: "getTicketcode",
                    authorization:'accessAuth'
                }
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getTicketcode = async(req,res, next)=>{
        let options = {
            where:{ 
                ticketId:{
                    [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) > Date('"+new Date().toISOString()+"') )")
                }
            }
        }

        this.readAll(options, 'tickets').then(results=>{
            if(results.length > 0){
                this.sendResponse({message:"System date mismatch. Please set correct date and time."}, res, 400)
            }
            else{
                let options = {
                    where:{
                        ticketId:{
                            [Sequelize.Op.in] : Sequelize.literal("(select ticketId from tickets where Date(createdDate) = Date('"+new Date().toISOString()+"') )")
                        }
                    },
                    order:[
                        ["ticketCode", "desc"]
                    ]
                }
                this.readAll(options, 'tickets').then(rows=>{
                    if(rows.length > 0){
                        console.log(rows[0].ticketCode)
                        var ticketcode = rows[0].ticketCode !== '' && rows[0].ticketCode !== undefined &&rows[0].ticketCode!==null ? rows[0].ticketCode : 0;
                        var count = Number(ticketcode)+1; 
                        this.sendResponse({ticketid: String(count).padStart(4, '0')}, res, 200)
                      }
                      else{
                        var count = 1;
                        this.sendResponse({ticketid: String(count).padStart(4, '0')}, res, 200)
                      }
                })

            }
        })
    }
}

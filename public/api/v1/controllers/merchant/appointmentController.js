/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
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
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    

    saveAppointment = async(req, res, next)=>{
        var input = req.input;
        this.sendResponse({data: input}, res, 200)
    }

    saveAppointmentServices = async(i, req, res, next)=>{
        
    }
}
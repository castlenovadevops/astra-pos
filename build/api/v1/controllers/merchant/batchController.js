/* eslint-disable no-useless-constructor */
const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');
 
module.exports = class BatchController extends baseController{
    path = "/merchant/batch"; 
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
                    method: "saveBatch",
                    authorization:"authorizationAuth"
                }, 
            ] 
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 
    

    saveBatch = async(req, res, next)=>{ 
        let batches = await this.readAll({},'batches')
        var batchname = "Batch "+(batches.length+1)
        var input  = {
            batchName: batchname,
            createdBy: req.userData.mEmployeeId,
            createdDate: this.getDate(),
            merchantId: req.deviceDetails.merchantId
        }
        this.create('batches', input).then(r=>{
            this.sendResponse({data: input}, res, 200)
        }).catch(e=>{
            this.sendResponse({message:"Error occurred. Please try again later"}, res, 400)
        })
    }
}
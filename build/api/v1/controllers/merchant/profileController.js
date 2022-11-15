const baseController = require('../common/baseController');
const MsgController = require('../common/msgController');

const express = require('express');
const authenticate = require('../../middleware/index');  
const Sequelize   = require('sequelize'); 


module.exports = class ProfileController extends baseController{
    path = "/merchant/profile";
    router = express.Router();
    msgController = new MsgController();
    constructor(props){
        super(props);
    }

    initialize(){ 
        return new Promise((resolve) => {
            // this.router.post(this.path+"/save", authenticate.accessAuth, this.saveCustomer); 
            this.router.get(this.path+"/getProfile", authenticate.authorizationAuth, this.getProfile);  
            resolve({MSG: "INITIALIZED SUCCESSFULLY"})
        });
    } 

    getProfile = async (req, res, next) =>{
        var userData = req.userData;

        const userDetail = await this.readOne({where:{mEmployeeId: userData.id}}, 'merchantEmployees');

        const merchants = await this.readAll({where:{
                    merchantId:{
                        [Sequelize.Op.in]: Sequelize.literal("(select merchantId from mEmpRefMerchant where mEmployeeId='"+userData.id+"')")
                    }
                },
                attributes:{
                    include:[
                        [
                            Sequelize.col(`merchantId`),
                            "id"
                        ],
                        [
                            Sequelize.literal("(select mEmployeePasscode from mEmpRefMerchant where mEmployeeId='"+userData.id+"' and merchantId=`merchant`.`merchantId`)"),
                            'mEmployeePasscode'
                        ],
                        [
                            Sequelize.literal("(select mEmployeeFirstName from merchantEmployees where mEmployeeId = (select mEmployeeId from mEmpRefMerchant where mEmployeeRole=(select roleId from lkup_role where roleName='Owner' and merchantId=`merchant`.`merchantId`) and merchantId=`merchant`.`merchantId`))"),
                            'merchantOwner'
                        ]
                    ]
                }
    
        }, 'merchant')

        this.sendResponse({data :  userDetail, merchants: merchants}, res, 200)
    }

}
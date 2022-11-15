const MerchantController = require('../controllers/merchant/merchantController');
const CustomerController = require('../controllers/merchant/customerController');
const DiscountController = require('../controllers/merchant/discountController');
const DefaultCommissionController = require('../controllers/merchant/defaultcommissionController');
const DefaultDiscountController = require('../controllers/merchant/defaultdiscountController');
const CategoryController = require('../controllers/merchant/categoryController');
const ProductController = require('../controllers/merchant/productController');
const TaxController = require('../controllers/merchant/taxController');
const MerchantEmployeeController = require('../controllers/merchant/employeeController');
const MEmployeeManager = require('../controllers/merchant/employeeManager');
const MEmployeeCommissionController = require('../controllers/merchant/employeeCommissionController');
const MProfileController = require('../controllers/merchant/profileController');
const CommonController = require('../controllers/common/commonController');

const SyncController = require('../controllers/pos/syncCodeController');

const express = require('express');
const path = require('path');

const cors = require('cors');
const authenticate = require('../middleware');
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 } 
   var router = express.Router();
    var contollers = [

        new CommonController(),

        // MERCHANT CONTROLLERS
        // new MerchantController(),
        // new CustomerController(),
        // new DiscountController(),
        // new DefaultCommissionController(),
        // new DefaultDiscountController(),
        // new CategoryController(),
        // new ProductController(),
        new TaxController(),
        // new MerchantEmployeeController(),
        // new MEmployeeManager(),
        // new MEmployeeCommissionController(),
        // new MProfileController()

        new SyncController()
    ] 
    function initialize(){ 
            initializeControllers(0); 
    }

    function initializeControllers(index){
        if(index < contollers.length){
            var controller = contollers[index]; 
            controller.initialize().then(r=>{ 
                // app.use("/api/v1/",cors(corsOptions), controller.router);
                initializeRoutes(0,controller.routes, index);
                // 
            })
        }
        else{
            console.log("ALL API REGISTEREd", router)  
        }
    }

   function initializeRoutes(idx, routes, index ){
        if(idx < routes.length){
            var controller = contollers[index];
            var route = Object.assign({},routes[idx])
            if(route !== undefined){
                if(route.authorization !== undefined && route.authorization !== ''){
                    if(route.type === 'post'){
                        router.post(route.path, authenticate[route.authorization], controller[route.method]);
                    }
                    else{      
                        router.get(route.path, authenticate[route.authorization],  controller[route.method]);
                    }
                }
                else{
                    if(route.type === 'post'){
                        console.log("ELSE CONND", route)
                        router.post(route.path, controller[route.method]);
                    }
                    else{ 
                        router.get(route.path, controller[route.method]);
                    }
                }
            }
            else{
                console.log("ELSE CONN 92 D")
            }
            initializeRoutes(idx+1, routes, index);
        }
        else{
            initializeControllers(index+1);
        }
    }
    initialize();
    module.exports = router;
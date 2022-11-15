const jwt = require('jsonwebtoken');


// don't forget to add a secret KEY

const Crypto= require('../utils/crypto');
const crypto = new Crypto();
module.exports = (req, res, next) => { 

    console.log("ACCESS AUTH CALLEd")
    try {
        const token = req.headers.accesstoken;  
        if(token){
            if(req.body.data){
                req.input = crypto.AESDecrypt( req.body.data); 
                console.log(crypto.AESDecrypt( req.body.data)); 
            }
            next();
        }
        else{
            return res.status(400).json({
                message: 'Access token failed'
            });
        }
    } catch (error) { 
        return res.status(401).json({
            message: 'Access token failed'
        });
    }
};

const jwt = require('jsonwebtoken');
const Crypto= require('../utils/crypto');


// don't forget to add a secret KEY
const secretKey = 'FGVxjxaLbnLT';//process.env.SECRETKEY || 'secret' ;
const crypto = new Crypto();
module.exports = (req, res, next) => {
    console.log("AUTHORIXATIONS AUTH CALLEd")
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, secretKey); 
        req.userData = decoded; 
        console.log("DECODED")
        console.log(decoded)
        if(req.body.data)
            req.input = crypto.AESDecrypt( req.body.data);
        next();
    } catch (error) {
        console.log("TOKEN FAILED")
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

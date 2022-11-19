const rest = require('restler'); 

const Crypto= require('../utils/crypto');
const crypto = new Crypto();
module.exports = class APIManager{
    baseAPI = "https://api.ci.dev.castlenova.net/api/v1";
    // baseAPI = "https://api.ci.dev.castlenova.net/api/v1";

    getRequest(url, req){ 
        return new Promise((resolve) => {
            const token = req.headers.authorization !== undefined && req.headers.authorization !== '' ? req.headers.authorization.split(" ")[1] : '';
            rest.get( this.baseAPI+url,{headers:{"Authorization" : "Bearer "+token, "accessToken" : req.headers.accesstoken}}).on('complete', function(result) {
                if (result instanceof Error) {
                console.log('Error:', result.message);
                } else {
                console.log(result);
                }
            });
        });
    }


    postRequest(url, data, req ){

        return new Promise((resolve) => {
            console.log(this.baseAPI+url)
            const token = req.headers.authorization !== undefined && req.headers.authorization !== '' ? req.headers.authorization.split(" ")[1] : '';
 
            rest.post( this.baseAPI+url,{
                headers:{"Authorization" : "Bearer "+token, "accesstoken" : req.headers.accesstoken},
                data: {data: crypto.AESEncrypt(data)}
            }).on('complete', function(result) { 
                console.log(result)
                resolve({response: crypto.AESDecrypt(result), status:200}); 
            }).on('fail', function(error){ 
                console.log("FAIL",  crypto.AESDecrypt(error))
               resolve({response: crypto.AESDecrypt(error), status:400})
            });
        })
    } 

}
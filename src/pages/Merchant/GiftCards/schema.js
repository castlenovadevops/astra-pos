module.exports = {
    "formName":"discounts",
    "properties": [
        {
            "component":"div", 
            "type": "text",
            "format":"string",
            "text" : "Gift Card",
            "style":{"font-size":"20px", "margin-top":"1rem"}
        },

        {
            "component":"Radio", 
            "type": "text", 
            "minLength": 1,
            "maxLength": 50,
            "grid":12,
            "name":"cardType",
            "label":"Card Type",
            "placeholder":"Card Type",
            "value":"Digital",
            "data":[
                {
                  "label":"Digital Card",
                  "value":"Digital"
                },
                {
                  "label":"Plastic Card",
                  "value":"Plastic"
                }
              ],
              "onChange":"onStateChange"
        }, 
        {
            "component":"TextField", 
            "type": "text", 
            "format":"hidden", 
            "minLength": 1,
            "maxLength": 12,
            "grid":6,
            "value":0,
            "name":"cardSold",
            "label":"Card Sold",
            "placeholder":"Card Sold"
        }, 
        {
            "component":"TextField", 
            "type": "text", 
            "format":"hidden", 
            "minLength": 1,
            "maxLength": 12,
            "grid":6,
            "name":"cardNumber",
            "label":"Card Number",
            "placeholder":"Card Number"
        }, 
        {
            "component":"div", 
            "name": "hiddendiv",
            "format":"string",
            "grid":6,
            "text" : "",
            "style":{"font-size":"20px", "margin-top":"1rem"}
        },
        {
            "component":"TextField", 
            "type": "text", 
            "format":"numberdecimal", 
            "minLength": 1,
            "maxLength": 16,
            "grid":4,
            "name":"cardValue",
            "label":"Card Value",
            "placeholder":"Card Value"
        }, 
          
        {
          "component":"TextField", 
          "type": "text", 
          "format":"date",
          "inputFormat":"MM/DD/YYYY",
          "minLength": 1,
          "maxLength": 50,
          "grid":4,
          "name":"validFrom",
          "label":"Valid From",
          "minDate":new Date(),
          "placeholder":"Valid From"
      },
          
      {
        "component":"TextField", 
        "type": "text", 
        "format":"date",
        "inputFormat":"MM/DD/YYYY",
        "minLength": 1,
        "maxLength": 50,
        "grid":4,
        "name":"validTo",
        "label":"Valid To",
        "minDate":new Date(),
        "placeholder":"Valid To"
    }

    ],
    "required": ["cardValue", "validFrom", "validTo"],
    "buttons":[
        {
          "label":"Save",
          "type":"submit",
          "variant":"contained",
          "grid":2
        },
        {
          "label":"Cancel",
          "type":"close",
          "variant":"outline",
          "grid":2
        }
    ],
    "onSubmit":{  
        "action":"API",
        "url":"merchant/giftcard/save",
        "method":"POST",
        "onSuccess":{
            "action":"reloadData"
        }
       
    }
}
/* eslint-disable no-redeclare */
/* eslint-disable no-useless-constructor */
const {models} = require('../../models');
const Crypto = require('../../utils/crypto');
const crypto = new Crypto();
const MsgController = require('./msgController');
  
const sequelize = require('sequelize'); 
const settings = require('../../config/settings');
const db = settings.database;

module.exports = class baseController extends MsgController{
    models = models;

    syncTables = ["mTax", "mCategory", "mProduct", "mDiscounts", "mCustomers"]

    constructor(props){
        super(props);
    }

    getDate(){
        return new Date().toISOString().replace("T"," ").replace("Z","")
    }
    

    sendResponse(response, res, status){ 
        res.status(status).send(crypto.AESEncrypt(response));
    }

    generaterandomString(length) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength)).trim();
        }

        return result;
    }


    async readOne(options, model){
        return new Promise(async (resolve) => {
            let results =  await this.models[model].findOne(options);
            resolve(results);
        });
    }

    async readAll(options, model){
        return new Promise(async (resolve) => {
            let results =  await this.models[model].findAll(options);
            resolve(results);
        });
    } 
    

    async create(model,data){ 
        return new Promise(async (resolve) => { 
            let results =  await this.models[model].create(data);
            if(this.syncTables.indexOf(model) !== -1){
                var pkquery = await db.query("SELECT k.column_name FROM information_schema.table_constraints t JOIN information_schema.key_column_usage k USING(constraint_name,table_schema,table_name) WHERE t.constraint_type='PRIMARY KEY' AND t.table_schema='"+settings.dbConfig.database+"' AND t.table_name='"+model+"'", { type: sequelize.QueryTypes.SELECT })
                var pkfield = pkquery.column_name
                var input = {
                    syncTable: model,
                    tableRowId: results[pkfield],
                    merchantId: data["merchantId"] || ''
                }
                await this.models["toBeSynced"].create(input);
                resolve(results)
            }
            else{
                resolve(results);
            }
        });
    }

    async delete(model, where){
        return new Promise(async (resolve) => {
            await this.models[model].destroy({
                where:  where
            })
            resolve('success')
        })
    }

    async update(model, data, where){ 
        return new Promise(async (resolve) => {
            let results =  await this.models[model].update(data, where);
            if(this.syncTables.indexOf(model) !== -1){
                var pkquery = await db.query("SELECT k.column_name FROM information_schema.table_constraints t JOIN information_schema.key_column_usage k USING(constraint_name,table_schema,table_name) WHERE t.constraint_type='PRIMARY KEY' AND t.table_schema='"+settings.dbConfig.database+"' AND t.table_name='"+model+"'", { type: sequelize.QueryTypes.SELECT })
                console.log("$$$$$$")
                console.log(data);
                var pkfield = pkquery[0].COLUMN_NAME
                var input = {
                    syncTable: model,
                    tableRowId: data[pkfield],
                    merchantId: data["merchantId"] || ''
                }
                await this.models["toBeSynced"].create(input);
                resolve(results)
            }
            else{
                resolve(results);
            }
        });
    }

    async updateWithNew(model, data, where, statusfield, pkfield){ 
        return new Promise(async (resolve) => {
            await this.models[model].update({[statusfield]: 2}, where).then(async r=>{
                var input = Object.assign({}, data);
                delete input[pkfield];
                let results = await this.models[model].create(input);
                if(this.syncTables.indexOf(model) !== -1){ 
                    var input = {
                        syncTable: model,
                        tableRowId: data[pkfield],
                        merchantId: data["merchantId"] || ''
                    }
                    await this.models["toBeSynced"].create(input);
                    resolve(results)
                }
                else{
                    resolve(results);
                }
            })
            // let results =  await this.models[model].update(data, where);
            // resolve(results);
        });
    }  
}
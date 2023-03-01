
const Sequelize = require('sequelize'); 
const path = require('path');  
const dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
}

const database = new Sequelize({
    database: 'astrapos',
    username: '',
    password: '',
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, "../../../../../DB/astrapos.sqlite")
});

console.log("DBPATH:::::", path.join(__dirname, "../../../../../DB/astrapos.sqlite")) 

database
.authenticate()
.then(function (err) {
// console.log("Connection established."); 
})
.catch(function (err) {
// console.log("Unable to connect to database: ", err);
});

const smtp = {
    SMTPHost:process.env.SMTPHOST,
    SMTPUsername: process.env.SMTPUSERNAME,
    SMTPPassword:process.env.SMTPPASSWORD
} 

const APIURL = "https://api.castlenova.net/api/v1"
module.exports = {dbConfig: dbConfig, database: database, smtp: smtp, APIURL: APIURL };
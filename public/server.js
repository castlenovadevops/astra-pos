var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app); 
var appPort = 1818;  
// uncomment after placing your favicon in /public
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(express.static(path.resolve(__dirname)));

// app.use(express.static(path.join(__dirname, 'build')));
// app.use('*/css',express.static(path.join(__dirname,'static/css')));
// app.use('*/js',express.static(path.join(__dirname,'static/js')));
// app.use('*/icons',express.static(path.join(__dirname,'static/icons')));
// app.use('*/illustrations',express.static(path.join(__dirname,'static/illustrations')));
// app.use('*/media',express.static(path.join(__dirname,'static/media')));
// app.use('*/images',express.static(path.join(__dirname,'static/mock-images')));
 
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, api-key,udid,device-type,Authorization");
  next();
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname)+'/index.html');
});

app.get('*', function (req, res,next) {
    console.log("GET",req.url);
    next();
});

app.post('*', function (req, res,next) {
    console.log("POST",req.url);
    next();
});
app.use('/api/v1/', require('./api/v1/routes')); 

// DB migration
async function checkForDBUpdate(){
    // try {
    //     let db=common.getDBConnection();
    //     common.setMasterDB(); //set master db connection
    //     let dbMaster = common.getMasterDBConnection();

    //     let getCurrentVersion = await common.execQuery("select * from others where name = 'current_node_server_version'",db);
    //     if(getCurrentVersion.data.length == 0) {
    //         migrateData(`petpooja_server_${appVersion}.sqlite`);
    //     } else {
    //         var checkforversion = 1;
    //         /*var migrate_dir = path.resolve(getPath('migrationDir'));
    //         if (!fs.existsSync(migrate_dir)) {
    //             await fs.mkdirSync(migrate_dir);
    //         }
    //         var filenames = fs.readdirSync(migrate_dir); 
    //         if(filenames.length > 1) {
    //             filenames.forEach(async function (file) {
    //                 await copyMigrateToBackup(file);
    //             });
    //         } else if (filenames.length == 1) {
    //             checkforversion = 0;
    //             var filename = 'migration.txt';
    //             var file = path.resolve(getPath('dbDir'), filename);
    //             var response_data = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")+' --- '+'Migration Start From migration folder file'+'\r\n';
    //             fs.appendFileSync(file,response_data);
    //             migrateData(filenames[0],1);
    //         } else {
                
    //         }*/
            
    //         var m_filename = 'petpooja_server_migration.sqlite';
    //         var m_file = path.resolve(getPath('dbDir'), m_filename);
    //         if (fs.existsSync(m_file)) {
    //             await deleteFile(m_filename);
    //         }
    //         // check if there is migration pending from migration table
    //         if(checkforversion == 1) {
    //             if(getCurrentVersion.data.length > 0 && getCurrentVersion.data[0].value != appVersion) {
    //                 console.log("CURR VERSION",getCurrentVersion.data[0], " ",appVersion[0]);
    //                 let dbVersion = getCurrentVersion.data[0].value || '0.0.0';
    //                 let app_version_bit = appVersion.substring(0,appVersion.indexOf(".")); 
    //                 let db_version_bit = dbVersion.substring(0,dbVersion.indexOf(".")); 
    //                 if(getCurrentVersion.data[0].value == null || parseInt(app_version_bit) > parseInt(db_version_bit) ){ // app_version_bit indicate first number before dot
    //                     var filename = 'migration.txt';
    //                     var file = path.resolve(getPath('dbDir'), filename);
    //                     var response_data = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")+' --- '+'Migration Start'+'\r\n';
    //                     fs.appendFileSync(file,response_data);
    //                     migrateData(`petpooja_server.sqlite`);
    //                 } else {
    //                     await common.setRestaurantConfiguration();
    //                     //await takeBackup(appVersion); //take backup for minor release as well (when there is no migration)

    //                     //update intra_server_version
    //                     let getMasterIntraServerVersion = await common.execQuery("select * from others where name = 'intra_server_version'", dbMaster);
    //                     let getCurrentIntraServerVersion = await common.execQuery("select * from others where name = 'intra_server_version'",db);
    //                     if(getMasterIntraServerVersion.data.length > 0 && getMasterIntraServerVersion.data[0].value != getCurrentIntraServerVersion.data[0].value){
    //                       await common.execQuery("update others set value='"+getMasterIntraServerVersion.data[0].value+"' where name='intra_server_version'", db);
    //                     }

    //                     //update kiosk_intra_server_version
    //                     let getMasterKioskIntraServerVersion = await common.execQuery("select * from others where name = 'kiosk_intra_server_version'", dbMaster);
    //                     let getCurrentKioskIntraServerVersion = await common.execQuery("select * from others where name = 'kiosk_intra_server_version'",db);
    //                     if(getMasterKioskIntraServerVersion.data.length > 0 && getMasterKioskIntraServerVersion.data[0].value != getCurrentKioskIntraServerVersion.data[0].value){
    //                       await common.execQuery("update others set value='"+getMasterKioskIntraServerVersion.data[0].value+"' where name='kiosk_intra_server_version'", db);
    //                     }

    //                     //update kds_intra_server_version
    //                     let getMasterKDSIntraServerVersion = await common.execQuery("select * from others where name = 'kds_intra_server_version'", dbMaster);
    //                     let getCurrentKDSIntraServerVersion = await common.execQuery("select * from others where name = 'kds_intra_server_version'",db);
    //                     if(getMasterKDSIntraServerVersion.data.length > 0 && getMasterKDSIntraServerVersion.data[0].value != getCurrentKDSIntraServerVersion.data[0].value){
    //                       await common.execQuery("update others set value='"+getMasterKDSIntraServerVersion.data[0].value+"' where name='kds_intra_server_version'", db);
    //                     }

    //                     //update captain_version
    //                     let getMasterCaptainIntraServerVersion = await common.execQuery("select * from others where name = 'captain_version'", dbMaster);
    //                     let getCurrentCaptainIntraServerVersion = await common.execQuery("select * from others where name = 'captain_version'",db);
    //                     if(getMasterCaptainIntraServerVersion.data.length > 0 && getMasterCaptainIntraServerVersion.data[0].value != getCurrentCaptainIntraServerVersion.data[0].value){
    //                       await common.execQuery("update others set value='"+getMasterCaptainIntraServerVersion.data[0].value+"' where name='captain_version'", db);
    //                     }

    //                     //update captain_version
    //                     let getMasterDeviceIntraServerVersion = await common.execQuery("select * from others where name = 'device_app_server_version'", dbMaster);
    //                     let getCurrentDeviceIntraServerVersion = await common.execQuery("select * from others where name = 'device_app_server_version'",db);
    //                     if(getMasterDeviceIntraServerVersion.data.length > 0 && getMasterDeviceIntraServerVersion.data[0].value != getCurrentDeviceIntraServerVersion.data[0].value) {
    //                       await common.execQuery("update others set value='"+getMasterDeviceIntraServerVersion.data[0].value+"' where name='device_app_server_version'", db);
    //                     }

    //                     // can not keep below query outside as migratedata function is not async await and query will be executed parallely
    //                     await common.execQuery("update others set value='"+appVersion+"' where name='current_node_server_version'", db);
    //                     await common.startup_function();
                        
    //                     let lastupdated_p_c = await common.execQuery("select modified from printer_codes order by modified DESC limit 1", db);
    //                     let p_c_query = "select * from printer_codes";
    //                     if(lastupdated_p_c.data.length > 0) {
    //                         p_c_query += " WHERE modified > '"+lastupdated_p_c.data[0].modified+"'";
    //                     }
    //                     let updated_p_c = await common.execQuery(p_c_query, dbMaster);
    //                     if(updated_p_c.data.length > 0) {
    //                         let stmtwords = "INSERT OR REPLACE INTO printer_codes (id,printer_code,status,errormessage,created,modified) VALUES";
    //                         for(let y in updated_p_c.data) {
    //                             stmtwords += "('" + updated_p_c.data[y].id + "','" + updated_p_c.data[y].printer_code + "','" + updated_p_c.data[y].status + "','" + common.replaceSpecialChar(updated_p_c.data[y].errormessage) + "','" + updated_p_c.data[y].created + "','" + updated_p_c.data[y].modified + "'),";
    //                         }
    //                         stmtwords = stmtwords.substr(0, stmtwords.length - 1);
    //                         await common.execQuery(stmtwords, db);
    //                     }
                        
    //                     let lastupdateddate = await common.execQuery("select modified from desktop_words order by modified DESC limit 1", db);
    //                     let desktop_words_query = "select * from desktop_words";
    //                     if(lastupdateddate.data.length > 0) {
    //                         desktop_words_query += " WHERE modified > '"+lastupdateddate.data[0].modified+"'";
    //                     }
    //                     let updatedwords = await common.execQuery(desktop_words_query, dbMaster);
    //                     if(updatedwords.data.length > 0) {
    //                         let stmtwords = "INSERT OR REPLACE INTO desktop_words (id,key_name,displayed_in,English,created,modified) VALUES";
    //                         for(let y in updatedwords.data) {
    //                             stmtwords += "('" + updatedwords.data[y].id + "','" + common.replaceSpecialChar(updatedwords.data[y].key_name) + "','" + common.replaceSpecialChar(updatedwords.data[y].displayed_in) + "','" + common.replaceSpecialChar(updatedwords.data[y].English) + "','" + updatedwords.data[y].created + "','" + updatedwords.data[y].modified + "'),";
    //                         }
    //                         stmtwords = stmtwords.substr(0, stmtwords.length - 1);
    //                         await common.execQuery(stmtwords, db);
    //                     }
    //                     let { webContents } = require('./main');
    //                     let language_words = await common.execQuery('SELECT * FROM desktop_words',db);
    //                     let language_title = {};
    //                          language_words.data.map(function (d) {
    //                          language_title[d.key_name] = d.English;
    //                     });
    //                     webContents.send('language_titles',{'language_title':language_title});
    //                     updateMigrationStatus(0);
    //                 }
    //             } else {
    //                 // can not keep below query outside as migratedata function is not async await and query will be executed parallely
    //                 await common.execQuery("update others set value='"+appVersion+"' where name='current_node_server_version'", db);
    //                 await common.startup_function();
    //                 updateMigrationStatus(0);
    //             }
    //         }
    //     }
    //     common.closeMasterDBConnection();
    // }
    // catch(ex) {
    //     console.log(ex);
    //     await common.async_insert_into_error_log(ex, 'checkForDBUpdate');
    // }
}
exports.checkForDBUpdate = checkForDBUpdate;
  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // console.log(req)
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on("uncaughtException",function(err){
  console.log("Error occured an caught in uncaughtException",err);
});

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    //process.exit();
    // application specific logging here
});
  
http.listen(appPort, function() {
    console.log('app listening on port ' + appPort.toString());
});

function resetSyncFlag() {
  global.sync_start_flag = 0;
}
exports.resetSyncFlag = resetSyncFlag;
 
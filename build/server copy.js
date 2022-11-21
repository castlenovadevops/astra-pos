const express = require('express');
const path = require('path');
const app = express();
const routes = require('./api/v1/routes')
// app.use(express.static(path.join(__dirname, 'build')));
const bodyParser = require('body-parser')
const cors = require('cors')
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, accessToken"
  );

  
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");
      
      
  next();
});
app.use('*/css',express.static(path.join(__dirname,'static/css')));
app.use('*/js',express.static(path.join(__dirname,'static/js')));
app.use('*/icons',express.static(path.join(__dirname,'static/icons')));
app.use('*/illustrations',express.static(path.join(__dirname,'static/illustrations')));
app.use('*/media',express.static(path.join(__dirname,'static/media')));
app.use('*/images',express.static(path.join(__dirname,'static/mock-images')));


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname)+'/index.html');
});
app.use(bodyParser.json()); 
app.options('*', cors(corsOptions)) 
app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: false }))

var routesController = new routes()
routesController.app = app; 
routesController.initialize().then(router=>{
  app.use('/api/v1', router); 
  // console.log(this.router);
  app.listen(1818, () => // console.log(`Express server listening on port 1818`));

  module.exports = {app};
})
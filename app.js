var express = require('express')
var app = express();
var csv = require('csv-to-json');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var geolib = require('geolib');
var passport = require('passport');
var mongoose = require('mongoose');
var cors = require('cors');
var config = require('./config/database');
var users = require('./routes/users');
var globals = require('./routes/globals');
var satellite = require('./routes/satellite')

var http = require('http');
var WebSocket = require('ws');

var server = http.createServer(app);
var wss = new WebSocket.Server({ server });
var wsConnections = {};
module.exports.wsConnections = wsConnections;

wss.on('connection', function connection(ws) {
  console.log('someone connected')

  var userKey;
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    try{
      var payload = JSON.parse(message);
      if(payload.hasOwnProperty("type") && payload.hasOwnProperty("id")){
        if(payload.type == "init"){
          userKey = payload.id;
          wsConnections[userKey] = ws;
        }
      }
    }catch(err){
      console.log(err);
    }
  });

  ws.on('close', function () {
    console.log(wsConnections)
    if(wsConnections.hasOwnProperty(userKey)){
      delete wsConnections[userKey];
    }
  });
});

mongoose.connect(config.database);
mongoose.connection.on('connected', function() {
	console.log('connected to db ' + config.database);
});

mongoose.connection.on('error', function(err) {
	console.log('db error ' + err);
})

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use('/api/', globals);

app.use('/api/users', users);

app.use('/api/satellite', satellite);


server.listen(3000, function () {
  console.log('Example app listening on port', server.address().port)
})
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


// setTimeout(function(){
// 	var filename = "data/fires.csv";

// 	var file = fs.createWriteStream(filename);

// 	var stream = request(csvUrl).pipe(file);

// 	stream.on('finish', function () { 
// 		var obj = {
// 	    	filename: filename
// 		}
		
// 		var callback = function(err, json) {
// 			return
// 		};

// 		csv.parse(obj, callback)
// 	});
// }, 60000);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
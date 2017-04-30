var express = require('express')
var app = express();
var csv = require('csv-to-json');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var geolib = require('geolib');
var csvUrl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";

var passport = require('passport');
var mongoose = require('mongoose');
var cors = require('cors');
var config = require('./config/database');
var users = require('./routes/users');

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

app.use('/users', users);


setTimeout(function(){
	var filename = "data/fires.csv";

	var file = fs.createWriteStream(filename);

	var stream = request(csvUrl).pipe(file);

	stream.on('finish', function () { 
		var obj = {
	    	filename: filename
		}
		
		var callback = function(err, json) {
			return
		};

		csv.parse(obj, callback)
	});
}, 60000);

app.get('/', function (req, res) {
  

	var filename = "data/fires.csv";

	var file = fs.createWriteStream(filename);

	var stream = request(csvUrl).pipe(file);

	stream.on('finish', function () { 
		var obj = {
	    	filename: filename
		}
		
		var callback = function(err, json) {
			return res.render('index.ejs', {data: JSON.stringify(json)})
		};

		csv.parse(obj, callback)
	});
})

app.post('/checkdanger', function(req, res){
	var body = req.body;
	var lat = body.lat;
	var lng = body.lng;

	var filename = "data/fires.csv";

	fs.readFile(filename, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

	  	var obj = {
	    	filename: filename
		}

		csv.parse(obj, function(err, json){
			for(var i = 0; i < json.length; i++){
				var flat = parseFloat(json[i].latitude);
				var flng = parseFloat(json[i].longitude);
				var fradius = parseInt(json[i].scan * 1000);

				if(json[i].latitude && json[i].longitude){
					var isInside = geolib.isPointInCircle({latitude: parseFloat(lat), longitude: parseFloat(lng)}, {latitude: flat, longitude: flng}, fradius);
					if(isInside){
						return res.json({
			    			result: true,
			    			msg: "You are in danger zone",
			    			radius: fradius,
			    			latitude: flat,
			    			longitude: flng
			    		});
					}
				}
    		}

    		return res.json({
    			result: false,
    			msg: "You are safe"
    		});
		})
	});

})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
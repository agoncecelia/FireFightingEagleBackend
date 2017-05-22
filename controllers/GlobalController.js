var User = require('../models/users');
var UserController = require('../controllers/UserController.js');

var modis = require('../models/MODIS');
var viirs = require('../models/VIIRS');

var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var apikeys = require('../config/apikeys');
var csv = require('csv-to-json');
var fs = require('fs');
var geolib = require('geolib');
var csvUrl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";

var Forecast = require('forecast');


var forecast = new Forecast({
  service: 'darksky',
  key: apikeys.darksky,
  units: 'celcius',
  cache: true,      // Cache API requests 
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
    minutes: 27,
    seconds: 45
  }
});


module.exports = {
	getActiveFires: function(req, res) {
		
		var coordinates = [];

		modis.find({},function(err, result) {
			if(err){
				console.log(err);
				return;
			}

			for(var i = 0 ; i < result.length; i++) {
				coordinates.push({latitude: result[i].latitude, longitude: result[i].longitude});
			}
			
			viirs.find({},function(verr, vresult){
				if(err){
					console.log(verr);
					return;
				}
				for(var i = 0 ; i < result.length; i++) {
					coordinates.push({latitude: vresult[i].latitude, longitude: vresult[i].longitude});
				}
				res.send({response: coordinates});
			})
		});
	},
	calculate: function(req, res){
		
		var windSpeed, temperature, humidity, humidityRisk, temperatureRisk, windSpeedRisk;

		var riskSum = 0;
		var riskLevel;

		forecast.get([req.params.lat, req.params.lon], function(err, weather) {
			if(err) return console.dir(err);
			temperature = weather.daily.data[4].temperatureMax;
			windSpeed = weather.daily.data[4].windSpeed;
			humidity = weather.daily.data[4].humidity;
		

			if(humidity >= 35 && humidity < 85) humidityRisk = 1;
			if(humidity >= 20 && humidity < 35) humidityRisk = 2;
			if(humidity < 20) humidityRisk = 3;

			if(windSpeed < 15) windSpeedRisk = 1;
			if(windSpeed >= 15 && windSpeed <= 20) windSpeedRisk = 2;
			if(windSpeed > 20) windSpeedRisk = 3;

			if(temperature > 29.5 && temperature < 40) {
				temperatureRisk = 2;
			} else if(temperature >= 40) {
				temperatureRisk = 3;
			} else {
				temperatureRisk = 1;
			}

			riskSum = temperatureRisk + windSpeedRisk + humidityRisk;

			if(riskSum <= 3){
				riskLevel = "Low";
				return res.send({
					riskLevel: riskLevel,
					riskSum: riskSum
				});
			} else if(riskSum > 3 && riskSum <= 6){
				riskLevel = "Medium";
				return res.send({
					riskLevel: riskLevel,
					riskSum: riskSum
				});
			} else if(riskSum > 6 && riskSum <= 9){
				riskLevel = "High";
				return res.send({
					riskLevel: riskLevel,
					riskSum: riskSum
				});
			}
		});
	}

}
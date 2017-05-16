var User = require('../models/users');
var UserController = require('../controllers/UserController.js');

var modis = require('../models/MODIS');
var viirs = require('../models/VIIRS');

var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var csv = require('csv-to-json');
var fs = require('fs');
var geolib = require('geolib');
var csvUrl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";

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
				console.log(coordinates.length)
				res.send(coordinates);
			})
		});

		

		// console.log(coordinates);
		
	},
	calculate: function(req, res){
		var body = req.body;
		var windSpeed = body.windSpeed;
		var temperature = body.temperature;
		var humidity = body.humidity;
		var humidityRisk, temperatureRisk, windSpeedRisk;

		var riskSum = 0;
		var riskLevel;

		if(humidity >= 35 && humidity < 85) humidityRisk = 1;
		if(humidity >= 20 && humidity < 35) humidityRisk = 2;
		if(humidity < 20) humidityRisk = 3;
		console.log('humidityRisk ' + humidityRisk);


		if(windSpeed < 15) windSpeedRisk = 1;
		if(windSpeed >= 15 && windSpeed <= 20) windSpeedRisk = 2;
		if(windSpeed > 20) windSpeedRisk = 3;
		console.log('windSpeedRisk ' + windSpeedRisk);


		if(temperature > 29.5 && temperature < 40) {
			temperatureRisk = 2;
		} else if(temperature >= 40) {
			temperatureRisk = 3;
		} else {
			temperatureRisk = 1;
		}
		console.log('temperatureRisk ' + temperatureRisk);

		riskSum = temperatureRisk + windSpeedRisk + humidityRisk;
		console.log('risk sum ' + riskSum);

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
	},
	receiveLocation: function(req, res) {
		var body = req.body;
		var userLocation = {
			gcmToken: body.gcmToken,
			deviceIMEI: body.deviceIMEI,
			geoLocation: body.geoLocation,
			timeStamp: body.timeStamp 
		};
		
		res.send({
			success: true,
			msg: "location received",
		});
	},

	reportFire: function(req, res) {
		var body = req.body;
		var fireLocation = {
			gcmToken: body.gcmToken,
			deviceIMEI: body.deviceIMEI,
			geoLocation: body.geoLocation,
			timeStamp: body.timeStamp 
		};
		
		res.send({
			success: true,
			msg: "fire location received",
		});
	}
}
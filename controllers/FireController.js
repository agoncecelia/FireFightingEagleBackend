var csv = require('csv-to-json');
var request = require('request');
var fs = require('fs');
var Fire = require('../models/fires');
var UserLocationController = require('../controllers/UserLocationController')
var UserLocation = require('../models/userLocation');
var gcm = require('node-gcm');
var apikeys = require('../config/apikeys');
var admin = require('firebase-admin');
var serviceAccount = require('../config/fire-fighting-eagle-firebase-adminsdk-4n4kg-cf1d8e64a2.json');


var MODISurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";
var VIIRSurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/viirs/text/VNP14IMGTDL_NRT_Global_24h.csv";


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fire-fighting-eagle.firebaseio.com/"
});
var defaultMessaging = admin.messaging();

module.exports = { 
    reportFire: function(req, res) {
        var body = req.body;
        var fireCoords = [body.location.coordinates[0], body.location.coordinates[1]];

        Fire.find({
            location: {
                $near: {
                    $geometry: {
                        "type": "Point",
                        "coordinates": fireCoords
                    },
                    $maxDistance: 100
                }
            },
            userReported: true
        }, function(err, result){
            if(err){
                return res.status(500).send(err);
            }
            
            if(result.length){
                res.send({
                    status: 200,
                    msg: "fire already reported"
                })
            }else{
               var newFire = new Fire({
                    location: {
                        type: "Point",
                        coordinates: fireCoords
                    },
                    userReported: true,
                    imei: body.imei
                });
                
                var searchData = {
                    latitude: body.location.coordinates[0], 
                    longitude: body.location.coordinates[1],
                    distance: 10000
                };
                Fire.saveFireLocation(newFire);

                UserLocation.getNearbyUsers(searchData, function(err, result) {
                    if (err) throw err;
                    if(result.length){
                        var registrationTokens = [];
                        for(var i = 0; i < result.length; i++){
                            registrationTokens.push(result[i].gcmToken);
                        }

                        var payload =  {
                            notification: {
                                title: "Fire alarm reported",
                                body: "We need help!"
                            },
                            data: {
                                msg: "Fire reported in area."
                            }
                        };

                        var options = {
                            priority: "high",
                            timeToLive: 60  * 60 & 24
                        };

                        defaultMessaging.sendToDevice(registrationTokens, payload, options).then(function(response) {
                            console.log('succesfully sent message: ', response);
                            

                            res.send({
                                status: 200,
                                msg: "fire reported and user notified succesfuly"
                            })
                        })
                        .catch(function(error) {
                            console.log('Error sending message', error);
                        });
                    } else {
                        res.send({
                            status: 200,
                            msg: "fire reported successfuly, no users in area"
                        })
                    }
                })
            }
        })
    }
}
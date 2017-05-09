var Satellite = require('../models/satelliteData');
var config = require('../config/database');
var csv = require('csv-to-json');
var request = require('request');
var fs = require('fs');

var MODISurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";
var VIIRSurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/viirs/text/VNP14IMGTDL_NRT_Global_24h.csv";

module.exports = {
    getMODISdata: function(req, res){
        var filename = "data/MODISdata.csv";
        var file = fs.createWriteStream(filename);
        var stream = request(MODISurl).pipe(file);

        stream.on('finish', function () { 
            var obj = {
                filename: filename
            }
            
            var callback = function(err, json) {

                for(var i = 0; i < json.length; i++){

                    var newData = new Satellite({
                        latitude: json[i].latitude,
                        longitude: json[i].longitude,
                        brightness: json[i].brightness,
                        scan: json[i].scan,
                        track: json[i].track,
                        acqDate: json[i].acqDate,
                        acqTime: json[i].acqTime,
                        satellite: json[i].satellite,
                        confidence: json[i].confidence,
                        version: json[i].version,
                        brightT31: json[i].brightT31,
                        frp: json[i].frp,
                        daynight: json[i].daynight
                    });
                    Satellite.saveMODISdata(newData);
                }
                
                res.send(200)
            };
            csv.parse(obj, callback)
        });
    },
    getVIIRSdata: function(req, ers) {
        var filename = "data/MODISdata.csv";
        var file = fs.createWriteStream(filename);
        var stream = request(MODISurl).pipe(file);

        stream.on('finish', function () { 
            var obj = {
                filename: filename
            }
            
            var callback = function(err, json) {

                for(var i = 0; i < json.length; i++){

                    var newData = new Satellite({
                        latitude: json[i].latitude,
                        longitude: json[i].longitude,
                        brightness: json[i].brightness,
                        scan: json[i].scan,
                        track: json[i].track,
                        acqDate: json[i].acqDate,
                        acqTime: json[i].acqTime,
                        satellite: json[i].satellite,
                        confidence: json[i].confidence,
                        version: json[i].version,
                        brightT31: json[i].brightT31,
                        frp: json[i].frp,
                        daynight: json[i].daynight
                    });
                    Satellite.saveVIIRSdata(newData);
                }
                
                res.send(200)
            };

            csv.parse(obj, callback)
        });
    }

}


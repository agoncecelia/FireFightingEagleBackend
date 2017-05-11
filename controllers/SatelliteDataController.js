var MODIS = require('../models/MODIS');
var VIIRS = require('../models/VIIRS');
var config = require('../config/database');
var csv = require('csv-to-json');
var request = require('request');
var fs = require('fs');

var MODISurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";
var VIIRSurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/viirs/text/VNP14IMGTDL_NRT_Global_24h.csv";

module.exports = {
    getMODISdata: function(req, res){
        console.log('modis')
        var filename = "data/MODISdata.csv";
        var file = fs.createWriteStream(filename);
        var stream = request(MODISurl).pipe(file);

        stream.on('finish', function () { 
            var obj = {
                filename: filename
            }
            
            var callback = function(err, json) {

                for(var i = 0; i < json.length; i++){

                    var newData = new MODIS({
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
                        daynight: json[i].daynight,
                        location: {
                            type: "Point",
                            coordinates: [json[i].latitude, json[i].longitude]
                        }
                    });
                    MODIS.saveMODISdata(newData);
                }
                res.send(200)
            };
            csv.parse(obj, callback)
        });
    },
    getVIIRSdata: function(req, res) {
        console.log('viirs')
        var filename = "data/VIIRSdata.csv";
        var file = fs.createWriteStream(filename);
        var stream = request(VIIRSurl).pipe(file);

        stream.on('finish', function () { 
            var obj = {
                filename: filename
            }
            
            var callback = function(err, json) {
                console.log(json[0])
                for(var i = 0; i < json.length - 1; i++){

                    var newData = new VIIRS({
                        latitude: json[i].latitude,
                        longitude: json[i].longitude,
                        bright_ti4: json[i].bright_ti4,
                        scan: json[i].scan,
                        track: json[i].track,
                        acqDate: json[i].acq_date,
                        acqTime: json[i].acq_time,
                        satellite: json[i].satellite,
                        confidence: json[i].confidence,
                        version: json[i].version,
                        bright_ti5: json[i].bright_ti5,
                        frp: json[i].frp,
                        daynight: json[i].daynight
                    });

                    VIIRS.saveVIIRSdata(newData);
                }
                res.send(200)
            };

            csv.parse(obj, callback)
        });
    },
    getNearbyFires: function(req, res) {
        console.log(req.body);
        MODIS.getNearbyFires(req, function(err, result) {
            if (err) return;
            console.log(result.length);
            res.send(result);
        })
    }
}


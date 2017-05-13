var csv = require('csv-to-json');
var request = require('request');
var fs = require('fs');
var Fire = require('../models/fires');

var MODISurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/MODIS_C6_Global_24h.csv";
var VIIRSurl = "https://firms.modaps.eosdis.nasa.gov/active_fire/viirs/text/VNP14IMGTDL_NRT_Global_24h.csv";


module.exports = { 
    reportFire: function(req, res) {
        var body = req.body;
        var newFire = new Fire({
            location: {
                type: "Point",
                coordinates: [body.location.coordinates[0], body.location.coordinates[1]]
            },
            userReported: true,
            imei: body.imei
        });
        console.log(newFire);
        Fire.saveFireLocation(newFire);
        res.send({
            status: 200,
            msg: "fire reported succesfuly"
        })
    }
}
var mongoose = require('mongoose');


var MODISSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number,
    brightness: Number,
    scan: Number,
    track: Number,
    acqDate: Date,
    acqTime: Number,
    satellite: String,
    confidence: Number,
    version: String,
    brightT31: Number,
    frp: Number,
    daynight: String
});

var VIIRSSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number,
    brightness: Number,
    scan: Number,
    track: Number,
    acqDate: Date,
    acqTime: Number,
    satellite: String,
    confidence: Number,
    version: String,
    brightT31: Number,
    frp: Number,
    daynight: String
});

var MODISmodel = module.exports = mongoose.model("MODIS", MODISSchema);
var VIIRSmodel = module.exports = mongoose.model("VIIRS", VIIRSSchema);

module.exports.saveVIIRSdata = function(newData){ 
    newData.save();
}

module.exports.saveMODISdata = function(newData) {
    newData.save();
}

// module.exports.getModisData = function()


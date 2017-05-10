var mongoose = require('mongoose');

var VIIRSSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number,
    bright_ti4: Number,
    scan: Number,
    track: Number,
    acqDate: Date,
    acqTime: Number,
    satellite: String,
    confidence: String,
    version: String,
    bright_ti5: Number,
    frp: Number,
    daynight: String
});

var VIIRS = module.exports = mongoose.model("VIIRS", VIIRSSchema);

module.exports.saveVIIRSdata = function(newData){ 
    newData.save();
}
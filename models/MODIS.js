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

var MODIS = module.exports = mongoose.model("MODIS", MODISSchema);

module.exports.saveMODISdata = function(newData) {
    newData.save();
}
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
    daynight: String,
    location: {
        type: {type: String},
        coordinates: [Number]
    }
});

VIIRSSchema.index({location: '2dsphere'});

var VIIRS = module.exports = mongoose.model("VIIRS", VIIRSSchema);

module.exports.saveVIIRSdata = function(newData){ 
    newData.save();
}

module.exports.getNearbyFires = function(req, callback) {
    VIIRS.find({
        'location': {
            $near: {
                $geometry: {
                    "type": "Point",
                    "coordinates": [req.body.latitude, req.body.longitude]
                },
                $maxDistance: req.body.distance
            }
        }
    }, callback);
}
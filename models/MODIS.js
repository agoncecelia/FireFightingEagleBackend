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
    daynight: String,
    location: {
        type: { type: String },
        coordinates: [Number]
    }
});

MODISSchema.index({location: '2dsphere'});
var MODIS = module.exports = mongoose.model("MODIS", MODISSchema);

module.exports.saveMODISdata = function(newData) {
    newData.save();
}

module.exports.getNearbyFires = function(req, callback) {
    MODIS.find({
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

// module.exports.getMODISdata = function()
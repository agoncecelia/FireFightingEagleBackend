var mongoose = require('mongoose');

var FireSchema = mongoose.Schema({
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    date: {
        type: Date,
        default: Date.now
    },
    userReported: {
        type: Boolean,
        default: false
    },
    imei: {
        type: String,
    },
    sos: {
        type: Boolean,
        default: false
    }
});

var Fire = module.exports = mongoose.model('Fire', FireSchema);
FireSchema.index({location: '2dsphere'});

module.exports.saveFireLocation = function(newData) {
    console.log(newData);
    newData.save();
}

module.exports.getNearbyFires = function(req, callback) {
    Fire.find({
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

module.exports.getAllFires = function(callback) {
    Fire.find({}, callback);
}
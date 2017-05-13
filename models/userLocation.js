var mongoose = require('mongoose');

var UserLocationSchema = mongoose.Schema({
    gcmToken: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    imei: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: {type: String},
        coordinates: [Number]
    }
});

var UserLocation = module.exports = mongoose.model('UserLocation', UserLocationSchema);
UserLocationSchema.index({location: '2dsphere'});

module.exports.getNearbyUsers = function(req, callback) {
    console.log(req.body);
    UserLocation.find({
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
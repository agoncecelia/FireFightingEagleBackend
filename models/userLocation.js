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
    },
    inDanger: {
        type: Boolean,
        default: false
    }
});

var UserLocation = module.exports = mongoose.model('UserLocation', UserLocationSchema);
UserLocationSchema.index({location: '2dsphere'});

module.exports.getNearbyUsers = function(req, callback) {
    UserLocation.find({
        location: {
            $near: {
                $geometry: {
                    "type": "Point",
                    "coordinates": [req.latitude, req.longitude]
                },
                $maxDistance: req.distance
            }
        }
    }, callback);
}
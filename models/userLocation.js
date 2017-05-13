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
        required: true
    },
    location: {
        type: {type: String},
        coordinates: [Number]
    }
});

var UserLocation = module.exports = mongoose.model('UserLocation', UserLocationSchema);
UserLocationSchema.index({location: '2dsphere'});

module.exports.saveUserLocation = function(newUserLocation) {

    UserLocation.findOneAndUpdate({imei: newUserLocation.imei}, newUserLocation, {upsert: true}, function(err, doc) {
        if(err) { throw err; }
        console.log('updated', doc);
    })

}

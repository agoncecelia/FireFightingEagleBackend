var UserLocation = require('../models/users');

module.exports = {
    updateLocation: function(req, res) {
        var body = req.body;

        var newUserLocation = new UserLocation({
            gcmToken: body.gcmToken,
            imei: body.imei,
            location: {
                type: "Point",
                coordinates: [body.location.coordinates[0], body.location.coordinates[1]]
            }
        });

        console.log(newUserLocation);
        UserLocation.saveUserLocation(newUserLocation);
        res.send({
            msg: "user location updated succesfuly"
        });
    }
}
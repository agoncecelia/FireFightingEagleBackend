var UserLocation = require('../models/userLocation');

module.exports = {
    updateLocation: function(req, res) {
        var body = req.body;
        console.log(body)
        UserLocation.findOne({"imei": body.deviceIMEI}, function(err, user){
            console.log(user)
            if(user != null){
                user.location.coordinates = [body.location.coordinates[0], body.location.coordinates[1]];
                user.gcmToken = body.gcmToken;
                user.save();
                console.log('location updated' + user);
                res.send({
                    msg: "user location updated succesfully"
                });
            }else{
               var newUserLocation = new UserLocation({
                    gcmToken: body.gcmToken,
                    imei: body.deviceIMEI,
                    location: {
                        type: "Point",
                        coordinates: [body.location.coordinates[0], body.location.coordinates[1]]
                    }
                }); 
                console.log('new Location' + newUserLocation);
                newUserLocation.save();
                res.send({
                    msg: "user location saved succesfully"
                });
            }
        });
        
    },

    markSafe: function(req, res) {
        var body = req.body;

        UserLocation.findOne({"imei": body.imei}, function(err, user) {
            if(user != null) {
                console.log(user);
                user.inDanger = false;
                user.save();
                res.send({
                    success: true,
                    msg: "user marked safe succesfully"
                });
            } else {
                res.send({
                    success: false,
                    msg: "no user found"
                });
            }
        });
    },

    nearbyUsers: function(req, res) {
        console.log(req.body)
        UserLocation.getNearbyUsers(req.body, function(err, result) {
            if (err) throw err;
            res.send(result);
        })
    }
}
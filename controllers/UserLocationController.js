var UserLocation = require('../models/userLocation');

module.exports = {
    updateLocation: function(req, res) {
        var body = req.body;

        UserLocation.findOne({"imei": body.imei}, function(err, user){
            if(user != null){
                user.location.coordinates = [body.location.coordinates[0], body.location.coordinates[1]];
                user.gcmToken = body.gcmToken;

                user.save();
                res.send({
                    msg: "user location updated succesfuly"
                });
                
            }else{
               var newUserLocation = new UserLocation({
                    gcmToken: body.gcmToken,
                    imei: body.imei,
                    location: {
                        type: "Point",
                        coordinates: [body.location.coordinates[0], body.location.coordinates[1]]
                    }
                }); 

                newUserLocation.save();
                res.send({
                    msg: "user location saved succesfuly"
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
    },
}
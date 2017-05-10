var User = require('../models/users');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = {
	register: function (req, res) {
		var newUser = new User({
	        departmentName: req.body.departmentName,
	        email: req.body.email,
	        username: req.body.username,
	        password: req.body.password,
			servingArea: req.body.servingArea,
			departmentLocation: req.body.departmentLocation,
			role: req.body.role
	    });

		console.log(req.body.departmentLocation)
	    User.addUser(newUser, (err, newUser) => {
			
	        newUser.token = jwt.sign(newUser, config.secret, {
	            expiresIn: 604800,
	        });

	        if(err) {
	            res.send({success: false, msg: 'Failed to register user'});
	            console.log(err);
	        } else {
	            res.send({success: true, msg: 'User registered succesfuly', user: newUser, token: newUser.token});
	        }
	    });
	},
	authenticate: function(req, res){
		var username = req.body.username;
	    var password = req.body.password;

	    User.getUserByUsername(username, function(err, user) {
	        if(err) throw err;
	        if(!user) {
	            return res.json({success: false, msg: 'User not found'});
	        }

	        User.comparePassword(password, user.password, function(err, isMatch) {
	            if(err) throw err;
	            if(isMatch) {
	                var token = jwt.sign(user, config.secret, {
	                    expiresIn: 604800, // this is 1 week
	                });

	                res.json({
	                    success: true,
	                    token: 'JWT ' + token,
	                    user: {
	                        id: user._id,
	                        departmentName: user.departmentName,
	                        username: user.username,
	                        email: user.email
	                    }
	                });
	            } else {
	                return res.json({ success: false, msg: 'Wrong password'});
	            }
	        });
	    });
	},
	profile: function(req, res){
		res.json({user: req.user});
	},
	isAuthenticated: function(req, res) {
		res.json({user: req.user});
		return true;
	},

	pendingUsers: function(req, res) {
		User.getPendingUsers(function(err, result) {
			res.send(result)
		})
	}
}
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
		newUser.token = jwt.sign(newUser, config.secret, {
	        expiresIn: 604800,
	    });
	    User.addUser(newUser, (err, newUser) => {

	        if(err) {
	            res.send({success: false, msg: 'Failed to register user'});
	            console.log(err);
	        } else {
	            res.send({success: true, msg: 'User registered succesfuly', user: newUser});
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
							departmentLocation: user.departmentLocation,
							servingArea: user.servingArea,
	                        username: user.username,
	                        email: user.email,
							role: user.role,
							active: user.active
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
		res.json({user: {
	                        id: req.user._id,
	                        departmentName: req.user.departmentName,
							departmentLocation: req.user.departmentLocation,
							servingArea: req.user.servingArea,
	                        username: req.user.username,
	                        email: req.user.email,
							role: req.user.role,
							active: req.user.active
	                    }});
		return true;
	},

	pendingUsers: function(req, res) {
		User.getPendingUsers(function(err, result) {
			res.send(result)
		})
	},
	approveUser: function(req, res) {
		var id = req.params.id;
		User.getUserById(id, function(err, result){
			var user = result;
			user.active = true;
			user.save(function(err) {
				if(err) return err;
			});
			res.send({
				status: 200,
				msg: 'User approved',
				success: true
			});
		})
	}
}
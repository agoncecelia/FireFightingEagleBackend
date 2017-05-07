var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

router.post('/register', (req, res, next) => {

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        newUser.token = jwt.sign(newUser, config.secret, {
            expiresIn: 604800,
        });

        console.log(newUser.token)
        if(err) {
            res.send({success: false, msg: 'Failed to register user'});
            console.log(err);
        } else {
            res.send({success: true, msg: 'user registered succesfuly', user: newUser, token: newUser.token});
        }
    });
});

router.post('/authenticate', function(req, res, next) {
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
                    token: token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password'});
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    res.json({user: req.user});
});

module.exports = router;
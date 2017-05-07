var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var UserController = require('../controllers/UserController');

router.post('/register', UserController.register);

router.post('/authenticate', UserController.authenticate);

router.post('/isAuthenticated', passport.authenticate('jwt', {session: false}), UserController.isAuthenticated);

router.get('/profile', passport.authenticate('jwt', {session: false}), UserController.profile);

module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var SatelliteController = require('../controllers/SatelliteDataController');

router.get('/getMODISdata', SatelliteController.getMODISdata);
router.get('/getVIIRSdata', SatelliteController.getVIIRSdata);
router.post('/getNearbyFires', SatelliteController.getNearbyFires);


module.exports = router;
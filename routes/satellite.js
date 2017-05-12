var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var SatelliteController = require('../controllers/SatelliteDataController');

router.get('/getMODISdata', SatelliteController.getMODISdata);
router.get('/getVIIRSdata', SatelliteController.getVIIRSdata);
router.post('/getNearbyMODISFires', SatelliteController.getNearbyMODISFires);
router.post('/getNearbyVIIRSFires', SatelliteController.getNearbyVIIRSFires);



module.exports = router;
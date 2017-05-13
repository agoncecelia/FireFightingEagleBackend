var express = require('express');
var router = express.Router();
var GlobalController = require('../controllers/GlobalController');
var FireController = require('../controllers/FireController');
var UserLocationController = require('../controllers/UserLocationController');

router.post('/checkdanger', GlobalController.checkdanger);

router.post('/calculate', GlobalController.calculate);

router.post('/receiveLocation', GlobalController.receiveLocation);

router.post('/reportFire', FireController.reportFire);

router.put('/updateLocation', UserLocationController.updateLocation);

router.post('/nearbyUsers', UserLocationController.nearbyUsers);


module.exports = router;
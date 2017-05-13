var express = require('express');
var router = express.Router();
var GlobalController = require('../controllers/GlobalController');
var FireController = require('../controllers/FireController');

router.post('/checkdanger', GlobalController.checkdanger);

router.post('/calculate', GlobalController.calculate);

router.post('/receiveLocation', GlobalController.receiveLocation);

router.post('/reportFire', FireController.reportFire);


module.exports = router;
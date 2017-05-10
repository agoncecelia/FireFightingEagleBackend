var express = require('express');
var router = express.Router();
var GlobalController = require('../controllers/GlobalController');

router.post('/checkdanger', GlobalController.checkdanger);

router.post('/calculate', GlobalController.calculate);

router.post('/receiveLocation', GlobalController.receiveLocation);


module.exports = router;
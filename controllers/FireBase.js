var admin = require("firebase-admin");
var gcm = require('node-gcm');
var apikeys = require('../config/apikeys');

var sender = new gcm.Sender(apikeys.gcmApi);





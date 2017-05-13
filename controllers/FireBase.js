var admin = require("firebase-admin");

var serviceAccount = require("../config/fire-fighting-eagle-firebase-adminsdk-4n4kg-cf1d8e64a2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fire-fighting-eagle.firebaseio.com"
});


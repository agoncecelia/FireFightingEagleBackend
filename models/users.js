var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var UserSchema = mongoose.Schema({
    departmentName: {
        type: String,
        required: true
    },
    servingArea: {
        type: String
    },
    departmentLocation: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getPendingUsers = function(callback) {
    User.find({active: false}, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

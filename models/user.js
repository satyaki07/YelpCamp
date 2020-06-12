var mongoose = require('mongoose');
var passpoertLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passpoertLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
var mongoose = require('mongoose');
var passpoertLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passpoertLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
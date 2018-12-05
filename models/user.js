var mongoose = require('mongoose'),
passportLocalMongoose  = require('passport-local-mongoose');

UserSchema = new mongoose.Schema({
    username: String,
    credits: {
        type: Number,
        default:0
    },
    password: String,
    typeOfUser : {
        type: String,
        default: 'user'
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);

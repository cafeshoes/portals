var mongoose = require('mongoose'),
passportLocalMongoose  = require('passport-local-mongoose');

adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    typeOfUser : {
        type: String,
        default: 'admin'
    }
});
adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("admin", adminSchema);
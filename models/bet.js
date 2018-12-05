var mongoose = require('mongoose'),

betSchema = new mongoose.Schema({
    user: String,
    match: String,
    team: String,
    betAmount: Number,
    one: String,
    two: String,
    date:{
        type: Date,
        default: Date.now
    },
    betStatus: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model("bet", betSchema);
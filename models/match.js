var mongoose = require('mongoose'),

matchSchema = new mongoose.Schema({
    teamOne: String,
    teamTwo: String,
    oneBetPercentage: Number,
    twoBetPercentage: Number,
    date: Date,
    time: String,
    matchStatus: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model("match", matchSchema);
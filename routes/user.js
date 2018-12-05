var express  = require('express'),
    app = express(),
    router =  express.Router(),
    admin = require("../models/admin"), 
    match =  require("../models/match"),
    bet =  require("../models/bet"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose  = require('passport-local-mongoose');

router.get("/login" , function(req, res) {
    res.render("user/login");
})
router.get("/", isLoggedin ,function(req, res) {
    match.find({}, function(err,data ){
        if(err)
            console.log(err);
        else {
            // console.log(data);  
            res.render("user/userLanding" ,{
                data: data
            });
        }
    })
})

router.post("/addbet", isLoggedin ,function(req, res) {
    bet.create({
        user: req.body.user,
        match: req.body.match,
        team: req.body.team,
        betAmount: req.body.betAmount,
        one: req.body.one,
        two: req.body.two
    }, function(err, data) {
        if(err) 
            return res.send(false);
        else {
            
            User.findOneAndUpdate({username: req.body.user}, {credits: req.body.updateCredit} , function(err, data) {
                if(err) {
                    return res.send(false);
                }
                else {
                    if(data.length=== 0)
                        return res.send(false);
                    else 
                        return res.send(true);

                }
            })
        }
    })
})

router.get("/bets",isLoggedin , function(req, res) {
    bet.find({} , function(err, data) {
        if(err)
            console.log(err);
        else {  
            console.log(data);
            res.render("user/bets", {
                data :  data
            })
        }
    })
})

//---------- MIDDLEWARES -------------//
function isLoggedin(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/user/login');
}

module.exports =  router;   
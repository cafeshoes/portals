var express  = require('express'),
    app = express(),
    router =  express.Router(),
    admin = require("../models/admin"), 
    match =  require("../models/match"),
    bet =  require("../models/bet"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose  = require('passport-local-mongoose');

//------------ POST ROUTE TO LOGIN ADMIN------//
router.post("/login",passport.authenticate('admin', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login'
}), function(req, res){
});

//---------- POST ROUTE TO CREATE A USER -------------//
router.post("/register", function(req,res) {
    admin.register(new admin({username: req.body.username}), req.body.password, function(err, ans) {
				if(err) {
					console.log(err);
					res.send('Error aa gayi');
				}
				else {
					// Authentication via passport
					passport.authenticate('admin')(req, res, function(){
						res.send("Registered!");
				});
        }
	});
});
router.get("/login",function(req, res) {
    res.render("admin/login");
})

router.get("/", isLoggedin, isAdmin, function(req, res) {
    admin.find({username:req.user.username},function(err,data) {
        if(err) {
            console.log("Admin error"+err);
            res.redirect("/admin/login")
        }
        else {
            match.find({}, function(err,data ){
                if(err)
                    console.log(err);
                else {
                    console.log(data);  
                    res.render("admin/portal" ,{
                        data: data
                    });
                }
            })
            
        }
    });
})

router.post("/addmatch", isLoggedin, function(req,res) {
    match.create({
        teamOne: req.body.teamOne,
        teamTwo: req.body.teamTwo,
        oneBetPercentage: req.body.onePercent,
        twoBetPercentage: req.body.twoPercent,
        date: req.body.date,
        time: req.body.time
    }, function(err, data) {
        if(err) 
            console.log(err);
        else {
            res.redirect("/admin");
        }
    })
})

router.post("/credits", isLoggedin, isAdmin,function(req, res) {
    User.findOneAndUpdate({username: req.body.username }, {$inc :{ credits : req.body.credits}}, {new: true}, function(err, data) {
                if(err) {
                    console.log(err);
                    res.send("Database connection error!")
                }
                else {
                    if(data !== null) {
                       return res.send("Success! Credits updated successfully!")
                    } else  {
                        return res.send("Error occurred")
                    }
                }
    })
})
//---------------------ADD A USER--------------------------------//
router.get("/adduser", isLoggedin, isAdmin,  function(req, res) {
    res.render("admin/addUser", {
                        newuserAdded : true,
                        userAdded: req.body.username,
                        postQuery: 0
                    })
});
router.post("/adduser", isLoggedin, isAdmin, function(req,res) {
    User.register(new User({
		username: req.body.username,
		phone: req.body.phone
	}), req.body.password, function(err, ans) {
				if(err) {
					console.log(err);
					res.render("admin/addUser", {
                        newuserAdded : false,
                        userAdded: req.body.username,
                        postQuery : 1
                    })
				}
				else {
					res.render("admin/addUser", {
                        newuserAdded : true,
                        userAdded: req.body.username,
                        postQuery : 1
                    })
				}
    })
})

router.get("/bets", isLoggedin, isAdmin, function(req,res) {
    bet.find({} , function(err, data) {
        if(err)
            console.log(err);
        else {  
            console.log(data);
            res.render("admin/bets", {
                data :  data
            })
        }
    })
})

router.get("/removeBet/:id" ,  isLoggedin, isAdmin,function(req, res) {
    bet.findOneAndRemove({_id: req.params.id}, function(err, data) {
        if(err)
            console.log(err)
        else {
            if(data!=='')
                res.redirect('/admin/bets')
        }

    })

})
//---------- POST ROUTE TO LOGOUT A USER -------------//
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/admin");
})


//---------- MIDDLEWARES -------------//
function isLoggedin(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin/login');
}

function isAdmin(req,res, next) {
    admin.find({username:req.user.username},function(err,data) {
        if(data.length === 0) {
            console.log("Admin error"+err);
            res.redirect("/")
        }
        else {
            return next();
        }
        console.log(req.user);
    })
}
module.exports =  router;
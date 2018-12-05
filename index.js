var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment')
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    path = require('path'),
    localStrategy = require('passport-local'),
    passportLocalMongoose  = require('passport-local-mongoose'),
    bodyParser = require('body-parser'),
    adminRoute =  require("./routes/admin"),
    userRoute =  require("./routes/user"),
    authRoute =  require("./routes/auth"),
    User = require("./models/user"),
    admin= require("./models/admin");

//----------------DATABASE CONNECTION--------------//
mongoose.connect('mongodb://localhost/portals', {native_parser: true,useNewUrlParser: true } );

//----------------BODY PARSER--------------//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//----------------BASIC SETUP--------------//
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static('public/css'));

//----------------SESSION & AUTHENTICATION-----------//
app.use(require('express-session')({
    secret: '=N"f"_RAZ%GVeq(%4N"`d\K!<=A(#96T\+-NL;rz;&qQ-VkgSL2z38w^;#NE:}-Nt',
    resave: false,
    saveUninitialized:false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
//Setting Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use('user',new localStrategy(User.authenticate()));
passport.use('admin',new localStrategy(admin.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, {id: user.id, type: user.typeOfUser });
});
passport.deserializeUser(function(data, done) {
    if(data.type=== 'user'){
      User.findById(data.id, function(err, user) {
        done(err, user);
      });
    } else{
      admin.findById(data.id, function(err, user) {
        done(err, user);
      });
    }
});
//Setting user for the variable
app.use(function(req, res, next){
    res.locals.currUser = req.user;
    next();
}); 


// //----------------ROUTES-----------------//
app.use("/auth",authRoute);
app.use("/user",userRoute);
app.use("/admin",adminRoute);

//Root Directory Traversal
app.get("/", function(req,res) {
    if(req.user) {
        res.redirect("/user");
    }
    else {
        res.redirect("/user/login");
    }
});

//--------------Server Init-----------------//
server.listen(process.env.PORT || 4200,function() {
	console.log("Server is live");
});
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var passportLocalMongoose = require("passport-local-mongoose");
var User=require('./models/User');
var det=require('./models/DetailSchema');
var username='admin';
var password='admin';
var listType=[['Registration Type','Count'],['Self',0],['Group',0],['Corporate',0],['Others',0]];

mongoose.connect("mongodb://localhost:27017/stackhack-reg",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});//connecting application to database

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(require("express-session")({
    secret:'Random',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

User.findOne({username:username},function(err,user){
    if(err)
        console.log(err);
    if(user)
        console.log('Administrator already registered');
    else
        User.register(new User({username: username}),password,function(err,user){
            if(err)
                console.log(err);
        });
});

app.get('/login',function(req,res){
        res.render('admin');
});

app.post('/login',passport.authenticate("local",{
    successRedirect: "/list",
    failureRedirect: "/login",
}),function(req,res){});

app.get('/list',isLoggedIn,function(req,res){
    det.find({},function(err,detail){
        if(err)
            console.log(err);
        else
            res.render('list',{detail:detail});
    })
    console.log(listType);
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
});

app.get('/list/chart',isLoggedIn,function(req,res){
    det.find({},function(err,detail){
        if(err)
           console.log(err);
        else
            res.render('Pie',{detail:detail});    
    });
});

app.get('/list/:id',isLoggedIn,function(req,res){
    det.findById(req.params.id,function(err,detail){
        if(err)
            console.log(err);
        else
            res.render('ViewProfile',{detail:detail});
    });
});

app.listen(3000,function(req,res){
    console.log("Server listening on port 3000");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.render('admin');
}

require('./models/RegistrationRoutes')(app);
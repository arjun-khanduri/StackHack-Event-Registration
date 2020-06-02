var username='admin';
var password='admin';
var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var passportLocalMongoose = require("passport-local-mongoose");
var User=require('./user');


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret:'Random',
    resave: false,
    saveUninitialized: false
}));
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.render('admin');
}


module.exports=function(app){
        app.get('/login',function(req,res){
            res.render('admin');
    });

        app.post('/login',passport.authenticate("local",{
            successRedirect: "/list",
            failureRedirect: "/login"
        }),function(req,res){});

        app.get('/list',isLoggedIn,function(req,res){
            res.render('list'); 
        });
}
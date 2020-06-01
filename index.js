var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/stackhack-reg",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
app.use(bodyParser.urlencoded({extended:true}));

var detSchema=new mongoose.Schema({
    fname: String,
    lname: String,
    num: String,
    email: String,
    type: String,
    ticketn:String
});
var det=mongoose.model("det",detSchema);

app.get('/',function(req,res){
    res.render('home'); 
//    res.redirect('/confirm');
});
app.post('/',function(req,res){
   det.create(req.body.detail,function(err,newUser){
      if(err)
          console.log(err);
       else
           res.redirect("/");
   }); 
});
app.get("/confirm",function(req,res){
    res.render('confirm');
})
app.listen(3000,function(req,res){
    console.log("Server online on port number 3000");
});
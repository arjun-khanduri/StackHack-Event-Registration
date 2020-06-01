var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var fs=require('fs');
var multer=require('multer');
var mongoose=require('mongoose');
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/stackhack-reg",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});//connecting application to database

var detSchema=new mongoose.Schema({
    fname: String,
    lname: String,
    num: String,
    email: String,
    type: String,
    ticketn:String,
    created:{type: Date, default: Date.now()},
    img:{data: Buffer, contentType: String}
});
var det=mongoose.model('det',detSchema);

/*Using Multer to store ID Card image*/

var filename=Date.now()+'.png';
var storage=multer.diskStorage({
    destination: function(req,file,cb){
        var path='./public/cards/'
        cb(null,path);
    },
    filename: function(req,file,cb){
        cb(null,filename);
    }
});
var upload=multer({storage: storage});

//det.remove({},function(err){
//    if(err)
//        console.log(err);
//    else
//        console.log("Removed");
//});


/*Route definition*/
app.get('/',function(req,res){
    res.render('home',{detail:null}); 
});


app.post('/',upload.single('detail[img]'),function(req,res){
    det.create(req.body.detail,function(err,newUser){
        var id=newUser._id.toString();
        var oldPath=__dirname+'/public/cards/'+filename;
        var newPath=__dirname+'/public/cards/'+id+'.png';
        fs.rename(oldPath,newPath,function(err){
            if(err)
                console.log(err);
        });
        if(err)
            console.log(err);
        else
            res.redirect('/confirm/'+id);
    });
});
app.get('/confirm/:id',function(req,res){
    det.findById(req.params.id,function(err,foundDetail){
        if(err)
            console.log(err);
        else
            res.render('confirm',{detail:foundDetail});  
    })

});

app.get('/success/:id',function(req,res){
   det.findById(req.params.id,function(err,found){
        if(err)
            console.log(err);
        else
            res.render('success',{detail:found});
   });
});

app.get('/edit/:id',function(req,res){
    var path=__dirname+'/public/cards/'+req.params.id+'.png';
    fs.unlink(path,function(err){
        if(err)
            console.log(err);
    });
    det.findById(req.params.id,function(err,found){
       if(err)
           console.log(err);
       else
           res.render('edithome',{detail:found});
   });
    det.remove({_id:req.params.id},function(err){
        if(err)
            console.log(err);
    });
});

app.listen(3000,function(req,res){
    console.log("Server listening on port 3000");
});
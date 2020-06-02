var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var fs=require('fs');
var multer=require('multer');
var det=require('./DetailSchema');
var path=require('path');
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
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
module.exports=function(app){
    app.get('/',function(req,res){
        res.render('home');
    });

    app.post('/',upload.single('detail[img]'),function(req,res){
        det.create(req.body.detail,function(err,newUser){
            var id=newUser._id.toString();
            var oldPath=path.join(__dirname,'../public/cards/',filename);
            var newPath=path.join(__dirname,'../public/cards/',id+'.png');
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
        var link=path.join(__dirname,'../public/cards/',req.params.id+'.png');
        fs.unlink(link,function(err){
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
}
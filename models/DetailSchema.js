var mongoose=require('mongoose');

var detSchema=new mongoose.Schema({
    fname: String,
    lname: String,
    num: String,
    email: String,
    type: String,
    ticketn:String,
    created:{type: Date, default: Date.now()},
});

module.exports=mongoose.model('det',detSchema);
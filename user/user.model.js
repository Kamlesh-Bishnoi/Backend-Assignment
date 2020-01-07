var mongoose=require("mongoose");
var Schema= mongoose.Schema;

var newSchema= new Schema({
    email           :{type:String, unique:true},
    password        :{type:String},
    contactNumber   :[Array],
    username        :{type:String},
    token           :{type:String},
    emailToken      :{type :String, unique:true},
    isActive        :{type:Boolean,default:false},
    creationDate    :{type:Date},
    updationDate    :{type:Date}
})

module.exports=mongoose.model("user",newSchema);
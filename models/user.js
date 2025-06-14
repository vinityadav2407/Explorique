const mongoose=require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    }
 });

//  yah by default users and password+salt+hash kar deta hai ans saht me addition method bhi add kar deta hai

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);

const express=require("express");
const router= express.Router();// router
const Listing=require("../models/listing");// listing schema

const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const User=require("../models/user");// user schema
const passport=require("passport");

router.get("/signup",async(req,res)=>{
res.render("users/signup.ejs");

});


router.post("/signup", wrapAsync(async(req,res)=>{
    try{
    let {username,email, password}=req.body;
    let newUser=new User({username,email,password});
     await User.register(newUser,password);
     req.flash("success","Welcome to the Explorique!");
     res.redirect(`/listings`);
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login" ,failureFlash:true}),(req,res)=>{
    req.flash("success","Welcome back to Explorique !!");
    res.redirect("/listings");
});
module.exports=router;
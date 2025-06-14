
const express=require("express");
const router= express.Router();// router
const Listing=require("../models/listing");// listing schema

const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const User=require("../models/user");// user schema
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");// redirect url middleware

router.get("/signup",async(req,res)=>{
res.render("users/signup.ejs");

});


router.post("/signup", wrapAsync(async(req,res)=>{
    try{
    let {username,email, password}=req.body;
    let newUser=new User({username,email,password});
     const registeredUser= await User.register(newUser,password);

      req.login( registeredUser,(err)=>{
        if(err){
         return next(err);
        }else{
           req.flash("success","Welcome to the Explorique!");
     res.redirect(`/listings`);
        }
    });

    
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login" ,failureFlash:true}),(req,res)=>{
    req.flash("success","Welcome back to Explorique !!");
    let redirectUrl=res.locals.redirectUrl || "/listings";// bez yadi ham home page par hai and then we try to login so error come becasue redriectUrl is empty
    res.redirect(  redirectUrl);
});

router.get("/logout",(req,res ,next)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }else{
          req.flash("success","You are successfully logout !!");
          res.redirect("/listings");
        }
    });
  
})

module.exports=router;
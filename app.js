const express=require("express");
const app=express();

const Listing=require("./models/listing");

const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js");// for the schema validation
const Review=require("./models/reviews");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

app.listen(8080,()=>{
    console.log("server is listening on the port:8080");
})

app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//*********Implementaion of the cookies and the sessions of the website into the browser************ */
const sessionOptions={
    secret:"Do'tTuchDangerofPrivacy",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());

// used for the authentication of the user and stored session to browser provide
//  yah by default users and password+salt+hash kar deta hai anu saht me addition method bhi add kar deta hai
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mongoose=require("mongoose");

main().then(()=>{
    console.log("connection to mongodb is successful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Explorique');
}

app.get("/",(req,res)=>{
    res.send("root is working well !!");
});

//*********** to save the cookies to the local temperory storage ******** */
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
    next();
});
// to use the listings route from the lising file
app.use("/listings" ,listingsRouter);

app.use("/listings/:id/reviews" ,reviewsRouter);

app.use("/",userRouter);
// app.get("/listingtest",async(req,res)=>{

//     let listing1=await newListing.save();
//     res.send("data save to dabase successfully");
// });




//**************************************** custom error handling (middleware function) *************************************************** */
//************************ add ExpressError************* */

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"));
// });

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something wend Wrong!"}=err;
res.status(statusCode).render("error.ejs", {message });

});


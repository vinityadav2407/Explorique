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

app.listen(8080,()=>{
    console.log("server is listening on the port:8080");
})

app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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
//*******************************for the schema validation(using the joi tools) *************************************** */
 const validateListing=(req,res,next)=>{
 let result=listingSchema.validate(req.body);// for the schema validation (using the joi tools)
    if(result.error){
        throw new ExpressError(404, result.error);
    }else{
        next();
    }
 };


 const validateReview=(req,res,next)=>{
 let result=reviewSchema.validate(req.body);// for the schema validation (using the joi tools)
    if(result.error){
        throw new ExpressError(404, result.error);
    }else{
        next();
    }
 };
// app.get("/listingtest",async(req,res)=>{

//     let listing1=await newListing.save();
//     res.send("data save to dabase successfully");
// });

// show all listings
app.get("/listings", wrapAsync(async (req,res)=>{
  let allListing= await Listing.find();
  res.render("./listings/index.ejs",{allListing});

}));
// new listing
app.get("/listings/new",(req,res)=>{
   res.render("./listings/new.ejs") ;
})
// show the specific listing
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}));

// post the listing to db
app.post("/listings",  validateListing,wrapAsync( async(req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new ExpressError(404,"Send the valid listing data");
    //  }

    let listing=req.body.listing;
    let newlisting=new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
    
}));

// edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

//update route
app.patch("/listings/:id", validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   let newupdate=await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));
// delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteupdate=  await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Review Route
//post route of reviews
app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
  
    const { id } = req.params;

    // 1. Find the listing by ID
    const listing = await Listing.findById(id);
    // 2. Create new review
    const newReview = new Review(req.body.review); 

    // 3. Associate review with listing
    listing.reviews.push(newReview);

    // 4. Save both
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));

//Review Delete Routes** */
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{

    let {id,reviewId}=req.params;
     await Listing.findByIdAndUpdate(id ,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);

   res.redirect(`/listings/${id}`);

}));

//**************************************** custom error handling (middleware function) *************************************************** */
//************************ add ExpressError************* */

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"));
// });

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something wend Wrong!"}=err;
res.status(statusCode).render("error.ejs", {message });

});


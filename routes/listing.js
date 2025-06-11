
const express=require("express");
const router= express.Router();
const Listing=require("../models/listing");

const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema,reviewSchema}=require("../schema.js");// for the schema validation



//*******************************for the schema validation(using the joi tools) *************************************** */
 const validateListing=(req,res,next)=>{
 let result=listingSchema.validate(req.body);// for the schema validation (using the joi tools)
    if(result.error){
        throw new ExpressError(404, result.error);
    }else{
        next();
    }
 };


// show all listings
router.get("/", wrapAsync(async (req,res)=>{
  let allListing= await Listing.find();
  res.render("./listings/index.ejs",{allListing});

}));
// new listing
router.get("/new",(req,res)=>{
   res.render("./listings/new.ejs") ;
})
// show the specific listing
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you are looking is not exits");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));

// post the listing to db
router.post("/",  validateListing,wrapAsync( async(req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new ExpressError(404,"Send the valid listing data");
    //  }

    let listing=req.body.listing;
    let newlisting=new Listing(listing);
    await newlisting.save();
    req.flash("success","New Listing added successfuly");
    res.redirect("/listings");
    
}));

// edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you are looking is not exits");
        res.redirect("/listings")
    }
    res.render("./listings/edit.ejs",{listing});
}));

//update route
router.patch("/:id", validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   let newupdate=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success"," Listing updated successfuly");
   res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteupdate=  await Listing.findByIdAndDelete(id);
     req.flash("success"," Listing delete successfuly");
    res.redirect("/listings");
}));

module.exports=router;
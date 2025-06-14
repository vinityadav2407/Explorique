
const express=require("express");
const router= express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");

const {listingSchema,reviewSchema}=require("../schema.js");// for the schema validation
const {isLoggedIn, isPermission,validateListing}=require("../middleware.js");




// show all listings
router.get("/", wrapAsync(async (req,res)=>{
  let allListing= await Listing.find();
  res.render("./listings/index.ejs",{allListing});

}));
// new listing
router.get("/new" ,isLoggedIn,(req,res)=>{
   res.render("./listings/new.ejs") ;
})
// show the specific listing
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate(
        {path:"reviews",
        populate:{
        path:"author",
    }}).populate("owner");
    
    if(!listing){
        req.flash("error","Listing you are looking is not exits");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));

// post the listing to db
router.post("/", isLoggedIn,isPermission, validateListing,wrapAsync( async(req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new ExpressError(404,"Send the valid listing data");
    //  }

    let listing=req.body.listing;
    let newlisting=new Listing(listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","New Listing added successfuly");
    res.redirect("/listings");
    
}));

// edit route
router.get("/:id/edit",isLoggedIn,isPermission,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you are looking is not exits");
        res.redirect("/listings")
    }
    res.render("./listings/edit.ejs",{listing});
}));

//update route
router.patch("/:id",isLoggedIn,isPermission, validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   
   let newupdate=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success"," Listing updated successfuly");
   res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id",isLoggedIn,isPermission,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteupdate=  await Listing.findByIdAndDelete(id);
     req.flash("success"," Listing delete successfuly");
    res.redirect("/listings");
}));

module.exports=router;
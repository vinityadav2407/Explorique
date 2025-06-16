
const express=require("express");
const router= express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage });

const {listingSchema,reviewSchema}=require("../schema.js");// for the schema validation
const {isLoggedIn, isPermission,  mergeImageData,validateListing}=require("../middleware.js");




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
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));

//post the listing to db
router.post("/", isLoggedIn,upload.single("listing[image]"),  mergeImageData, validateListing, wrapAsync( async(req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new ExpressError(404,"Send the valid listing data");
    //  }
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url, " " ,filename);
    let listing=req.body.listing;
    let newlisting=new Listing(listing);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url};
    await newlisting.save();
    req.flash("success","New Listing added successfuly");
    res.redirect("/listings");
    
}));

// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });

// edit route
router.get("/:id/edit",isLoggedIn,isPermission,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you are looking is not exits");
       return res.redirect("/listings")
    }
    res.render("./listings/edit.ejs",{listing});
}));

//update route
router.patch("/:id",isLoggedIn, upload.single("listing[image]"),  mergeImageData,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   
   let newupdate=await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if( typeof req.file != "undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    newupdate.image={filename,url};
    await newupdate.save();
   }
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
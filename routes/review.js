
const express=require("express");
const router= express.Router({mergeParams:true});
const Listing=require("../models/listing");

const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema,reviewSchema}=require("../schema.js");// for the schema validation
const Review=require("../models/reviews");
const listings=require("../routes/listing.js");



//*******************************for the schema validation(using the joi tools) *************************************** */
 const validateReview=(req,res,next)=>{
 let result=reviewSchema.validate(req.body);// for the schema validation (using the joi tools)
    if(result.error){
        throw new ExpressError(404, result.error);
    }else{
        next();
    }
 };

 
 // Review Route
 //post route of reviews
 router.post("/",validateReview,wrapAsync( async (req, res) => {
   
     const { id } = req.params;
 console.log(req.body.review);
     // 1. Find the listing by ID
     const listing = await Listing.findById(id);
     // 2. Create new review
     const newReview = new Review(req.body.review); 
   
     // 3. Associate review with listing
     listing.reviews.push(newReview);
 
     // 4. Save both
     await newReview.save();
     await listing.save();
     req.flash("success","New Review added successfully");
     res.redirect(`/listings/${id}`);
 }));
 
 //Review Delete Routes** */
 router.delete("/:reviewId",wrapAsync(async(req,res)=>{
 
     let {id,reviewId}=req.params;
      await Listing.findByIdAndUpdate(id ,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
 
       req.flash("success","Review  was deleted successfully");
    res.redirect(`/listings/${id}`);
 
 }));

 module.exports=router;
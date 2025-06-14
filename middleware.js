let Listing=require("./models/listing");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/reviews");
const {listingSchema,reviewSchema}=require("./schema.js");

//*******************************for the schema validation(using the joi tools) *************************************** */
 module.exports.validateListing=(req,res,next)=>{
 let result=listingSchema.validate(req.body);// for the schema validation (using the joi tools)
    if(result.error){
        throw new ExpressError(404, result.error);
    }else{
        next();
    }
 };

//*******************************for the schema validation(using the joi tools) *************************************** */
 module.exports.validateReview=(req,res,next)=>{
 let result=reviewSchema.validate(req.body);// for the schema validation (using the joi tools)
    if(result.error){
        throw new ExpressError(404, result.error);
    }else{
        next();
    }
 };


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
     // stored the url of that task which is done by user befor login so user can redirct that url ofter login
         if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};
// we store the redirectUrl because when we get's just logged in then possport erased the all session so we need to stored it
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// middleware fot the authorization (that user have the permission to edit and delete the listing)
module.exports.isPermission=async(req,res,next)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){
         req.flash("error","You are not the owner of this Listing");
         return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
   let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currUser._id)){
         req.flash("error","You are not the author of this reivew");
         return res.redirect(`/listings/${id}`);
    }
    next();
}




 
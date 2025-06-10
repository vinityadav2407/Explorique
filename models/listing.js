const mongoose=require("mongoose");
const Review=require("./reviews.js");

// create schema
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    discription:{
        type:String,
    },
//    image: {
//     type: String,
//     default: "https://media-cdn.tripadvisor.com/media/photo-s/16/56/70/c9/random-hotel-shots.jpg",
//     set: (v) => v === "" ? "https://media-cdn.tripadvisor.com/media/photo-s/16/56/70/c9/random-hotel-shots.jpg" : v,
// },
  image: {
    filename: String,
    url: String
  },
price:Number,
location:String,
country:String,

reviews:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Review",
}],

});

// ************************* handling the deletion useing the mongoose middleware(for review if we delete the listing then into the review the review should be also delete)**********************************/
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
const mongoose=require("mongoose");


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
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
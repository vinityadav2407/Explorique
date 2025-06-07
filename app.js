const express=require("express");
const app=express();

const Listing=require("./models/listing");

const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");


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
// app.get("/listingtest",async(req,res)=>{

//     let listing1=await newListing.save();
//     res.send("data save to dabase successfully");
// });

// show all listings
app.get("/listings", async (req,res)=>{
  let allListing= await Listing.find();
  res.render("./listings/index.ejs",{allListing});

})
// new listing
app.get("/listings/new",(req,res)=>{
   res.render("./listings/new.ejs") ;
})
// show the specific listing
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})

// post the listing to db
app.post("/listings",async(req,res)=>{
    let listing=req.body.listing;
    // console.log(listing);
    let newlisting=new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
})

// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

//update route
app.patch("/listings/:id",async(req,res)=>{
    let {id}=req.params;
   let newupdate=await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
})
// delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deleteupdate=  await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
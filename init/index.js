const mongoose=require("mongoose");

main().then(()=>{
    console.log("connection to mongodb is successful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Explorique');
}

// for the data
const initData=require("./data");
// for schema
const Listing=require("../models/listing");

const initDB= async()=>{
    // await Listing.deleteMany({});
     await Listing.insertMany(initData.data);
};

initDB();
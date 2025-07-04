const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// to add the our backend to the cloudinary
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET,
})


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'explorique_DEV',
    allowedFormat: ["png","jpg","jpeg"],
  },
});

module.exports={
    cloudinary,
    storage,
};
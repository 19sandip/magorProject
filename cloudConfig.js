const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET

});


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params :{
        folder : "wanderLust_DEV",
        allowFormats : ["png", "jpg", "jpeg", "pdf"]
    }
});

module.exports = {
    cloudinary,
    storage
}
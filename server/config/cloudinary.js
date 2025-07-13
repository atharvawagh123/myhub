const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

//  <input type="file" name="photo" accept="image/*" required /><br /><br /> upload image in cloudinary by using this syntax


// configure cloudinary with your credentials 
cloudinary.config(
    {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }
);

//store image in cloudinary stepup 
const storage = new CloudinaryStorage({
     cloudinary,
     params: {
         folder: 'uploads',
         allowedFormats: ['jpg', 'png', 'jpeg']
     } 
})

const upload = multer({storage});



module.exports = {cloudinary, storage, upload};
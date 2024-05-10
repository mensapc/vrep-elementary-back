const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const CustomError = require('../utils/CustomError');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'elibrary',
      resource_type: 'raw', // or use 'auto' which intelligently detects file type
      public_id: (req, file) => file.originalname, // Use original file name as public ID
  }
});


const parser = multer({ storage: storage });

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, { folder: 'image' });
    if (!result) throw new CustomError('Error uploading image', 500);
    return result.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new CustomError('Error uploading image', 500);
  }
};

module.exports = { uploadImage , parser };
//,
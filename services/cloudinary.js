const cloudinary = require('cloudinary');
const CustomError = require('../utils/CustomError');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'rpms',
    });
    if (!result) throw new CustomError('Error uploading image', 500);
    return result.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new CustomError('Error uploading image', 500);
  }
};

module.exports = { uploadImage };

const util = require('util');
const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

exports.cloudinaryUploader = util.promisify(cloudinary.uploader.upload);
exports.cloudinaryDestroyer = util.promisify(cloudinary.uploader.destroy);

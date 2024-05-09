const multer = require('multer');

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif','image/svg+xml' ];
const imageFilter = (req, file, cb) => {
  if (allowedImageTypes.includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};
const imageStorage = multer.diskStorage({});
const multerMiddleware = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).single('file');

module.exports = multerMiddleware;

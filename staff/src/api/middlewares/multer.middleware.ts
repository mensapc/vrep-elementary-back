import multer from "multer";

const allowedImageTypes = [
  "imagejpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];
//@ts-ignore
const imageFilter = (req, file, cb) => {
  if (allowedImageTypes.includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};
const imageStorage = multer.diskStorage({});
const multerMiddleware = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).single("file");

export default multerMiddleware;

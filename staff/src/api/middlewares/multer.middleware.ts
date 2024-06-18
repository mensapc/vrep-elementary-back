import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const allowedImageTypes = [
  "imagejpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedImageTypes.includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};
const imageStorage = multer.diskStorage({});
const multerMiddleware = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).single("file");

export default multerMiddleware;

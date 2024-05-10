
// const parser = require('../services/cloudinary');

// // Higher-order function to apply middleware
// function withMiddleware(middleware, handler) {
//     return (req, res, next) => {
//         middleware(req, res, err => {
//             if (err) return next(err);
//             handler(req, res, next);
//         });
//     };
// }

// exports.fileUpload = withMiddleware(parser.single(file), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded');
//     }
//     res.status(201).send(`File uploaded successfully: ${req.file.path}`);
// });
// git 
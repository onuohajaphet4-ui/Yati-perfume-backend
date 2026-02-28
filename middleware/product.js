// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const productDir = "uploads/products";

// // make sure folder exists (safety net)
// if (!fs.existsSync(productDir)) {
//   fs.mkdirSync(productDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, productDir);
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files allowed"), false);
//   }
// };

// export const productUpload = multer({
//   storage,
//   fileFilter,
// });
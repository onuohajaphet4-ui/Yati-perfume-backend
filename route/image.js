import express from 'express'
import {image} from "../model/image.js"
import protectMiddleware from "../middleware/auth.js";
const router = express.Router ()
import upload  from '../config/multer.js'

// Multer setup (1 image only)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

router.post("/image", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const images = new image({
      imageUrl: req.file.path,
    });

    await images.save();

    res.json({
      message: "Uploaded & saved to database",
      images
    });

    

  } catch (error) {
     console.error("UPLOAD ERROR:", error);
    console.error(error)
    res.status(500).json({ message: "Upload failed", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const images = await image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

router.delete("/delete/:id", async (req, res) => {
 try {
            const id  = req.params.id
            const images = await image.findByIdAndDelete(id)
            if(!images) return res.status(400).json({message: 'Image not exist'}) 
            res.status(201).json({ success:true,
         message: 'gallery deleted successful'})
            await images.deleteOne ()
              
        } catch (error) {
            res.status(500).json({ success:false,message:"Sever Error", error})
        }
});

export default router

router.get("/test-auth", protectMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
})
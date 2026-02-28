import express from 'express'
import { uploadImage, createProduct, deleteProduct, getAllProducts ,  getProductById, reviewProduct, updateProduct, } from '../controller/product.js'
import upload from '../config/multer.js'
const router = express.Router ()

router.post ('/image', upload.single("image"),  uploadImage)
router.post ('/',  createProduct)
router.post ('/review/:id',  reviewProduct)
router.get ('/',  getAllProducts)
router.get ('/:id', getProductById)
router.delete ('/delete/:id', deleteProduct)
router.put ('/update/:id', updateProduct)
export default router
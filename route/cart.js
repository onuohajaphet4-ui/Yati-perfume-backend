import express from 'express'
import  {addCart, deleteCart, getAllCart,getCartById, updateCart } from '../controller/cart.js'
import auth from "../middleware/auth.js"

const router = express.Router ()

router.post ('/', auth,   addCart)
router.get ('/', auth, getAllCart)
router.get ('/:id', auth, getCartById)
router.put ('/:id', auth, updateCart)
router.delete ('/delete/:id', auth, deleteCart)

export default router
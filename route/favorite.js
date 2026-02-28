import express from "express"
import {
  addToFavorite,
  getFavorites,
  removeFromFavorite
} from "../controller/favorite.js"

import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/", auth, addToFavorite)
router.get("/", auth, getFavorites)
router.delete("/:id", auth, removeFromFavorite)

export default router
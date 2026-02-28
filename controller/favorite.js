import { favorite } from "../model/favorite.js"
import { image } from "../model/image.js"



// ➕ Add to Favorite
export const addToFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { imageId } = req.body

    const images = await image.findById(imageId)
    if (!images) {
      return res.status(404).json({ message: "Image not found" })
    }

    const favorites = await favorite.create({
      user: userId,
      image: imageId
    })

    res.status(201).json({ message: "Added to favorites", favorite })

  } catch (error) {

    // duplicate error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already in favorites" })
    }

    res.status(500).json({ message: error.message })
  }
}




//  Get User Favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id

    const favorites = await favorite.find({ user: userId })
      .populate("image")

    res.status(200).json(favorites)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}




// Remove from Favorite
export const removeFromFavorite = async (req, res) => {
 try {
            const id  = req.params.id
            const images = await favorite.findByIdAndDelete(id)
            if(!images) return res.status(400).json({message: 'Image not exist'}) 
            res.status(201).json({ success:true,
         message: 'product deleted successful'})
            await images.deleteOne ()
              
        } catch (error) {
            res.status(500).json({ success:false,message:"Sever Error", error})
        }
}
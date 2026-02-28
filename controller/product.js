import {product} from "../model/product.js"

export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      imageUrl: req.file.path, // Cloudinary URL
    });

  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const createProduct  = async (req, res) => {
    try {
         console.log("BODY:", req.body)
        const{
        name,price,discription,category,imageUrl,brand,stock,section
    } = req.body
    const newProducts = await product.create({
       name,
       price,
       discription,
       category,
       imageUrl,
       brand,
       stock,
       section

    })
   
    res.status(201).json ({
        success:true,
        message: 'product created', newProducts
        
    })
    } catch (error) {
         res.status(500).json ({
            success:false,
            message:'Server Error', error
        })
    }
}

 //Get all product//

export const getAllProducts = async (req, res) => {
  try {
    const { section, sort } = req.query;

    const filter = section ? { section } : {};

    let sortOption = { createdAt: -1 }; // default = Normal

    if (sort === "low") sortOption = { price: 1 };
    if (sort === "high") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { totalSold: -1 };

    const products = await product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};




//Get Product by id

   export const getProductById = async (req, res) => {
      const productId  = req.params.id
      try {
         const productss = await product.findById(productId)
            if(!productss) return res.status(404).json({message: 'product not found'})
            res.status(200).json({
              success:true,
             productss})

      } catch (error) {
        res.status(500).json({ success:false,
            message: error.message})
      }
   }

   //delete
export const deleteProduct  = async (req, res) => {
       try {
           const id  = req.params.id
           const productss = await product.findByIdAndDelete(id)
           if(!productss) return res.status(400).json({message: 'product not exist'}) 
           res.status(201).json({ success:true,
        message: 'product deleted successful'})
           await productss.deleteOne ()
             
       } catch (error) {
           res.status(500).json({ success:false,message:"Sever Error", error})
       }
}


//Update productss  //
    export const updateProduct = async (req, res) => { 
        let productId =req.params.id 
        const{name, 
            price ,
            discription,
            category,
            imageUrl,
            brand,
            stock,
            section
} = req.body

        try {
            let productss = await product.findByIdAndUpdate(productId)
              if(!productss) return res.status(404).json({message: 'productss Not Found'})
             

          // update only provided fields //
           
            productss.name= name || productss.name
            productss.price= price || productss.price
            productss.discription= discription || productss.discription
            productss.imageUrl= imageUrl || productss.imageUrl
            productss.brand= brand || productss.brand
            productss.category= category  || productss.category
            productss.section= section || productss.section
            productss.stock= stock|| productss.stock
           
            
            await productss.save()

             res.status(200).json({ success:true,message: 'productss succesfully updated', productss: {
                id: productss._id,
                name: productss.name,
                price: productss.price,
                discription: productss.discription,
                imageUrl: productss.imageUrl,
                category: productss.category,
                brand: productss.brand,
                section: productss.section,
                stock: productss.stock,
               
             }

             })

         


        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

export const reviewProduct   = async (req, res) => { 
     const { user, rating, comment } = req.body;

  const products = await product.findById(req.params.id);

  if (!products) {
    return res.status(404).json({ message: "Product not found" });
  }

  // add review
  products.reviews.push({ user, rating, comment });

  // calculate new average
  const total = products.reviews.reduce((sum, r) => sum + r.rating, 0);
  products.averageRating = total / products.reviews.length;

  await products.save();

  res.json({ success: true })
}

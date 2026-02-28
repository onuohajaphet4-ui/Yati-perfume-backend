import express from "express";
import {cart} from "../model/cart.js";
 

export const addCart = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { productId } = req.body;
    const userId = req.user.id

    console.log("User:", userId);
    console.log("product:", productId);


    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json({ message: "Quantity increased" });
    }

    const newCart = new cart({ userId, productId });
    await newCart.save();

    res.json({ message: "Added to cart" });

  } catch (err) {
    console.log("ERROR:", err);  
    res.status(500).json(err.message);
  }
};



export const getAllCart = async (req, res) => {
        try {
                    let carts = await cart.find({userId:req.user.id}).populate('productId')
                    res.status(200).json(carts)
                } catch (error) {
                    res.status(500).json({message:"Sever Error", error})
                }
}


//Get Product by id

   export const getCartById = async (req, res) => {
      const productId  = req.params.id
      try {
         const carts = await cart.findById(productId)
            if(!carts) return res.status(404).json({message: 'product not found'})
            res.status(200).json({
              success:true,
             carts})

      } catch (error) {
        res.status(500).json({ success:false,
            message: error.message})
      }
   }

   //delete
export const deleteCart  = async (req, res) => {
       try {
           const id  = req.params.id
           const carts = await cart.findByIdAndDelete(id)
           if(!carts) return res.status(400).json({message: 'product not exist'}) 
           res.status(201).json({ success:true,
        message: 'product deleted successful'})
             
       } catch (error) {
           res.status(500).json({ success:false,message:"Sever Error", error})
       }
}




 export const updateCart = async (req, res) => { 
 try {
    const { quantity } = req.body;

    const updatedCart = await cart.findByIdAndUpdate(
      req.params.id,
      { quantity: quantity },
      { new: true }
    ).populate("productId");

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};



import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const productSchmema = new mongoose.Schema(
    {
        name:{
            type:String , required:true
        },
        price:{
            type:Number , required:true
        },
        discription:{
            type:String , required:true
        },
        imageUrl:{
            type:String 
        },
        stock:{
            type:String 
        },
        category:{
            type:String 
        },
        brand:{
            type:String 
        },
        section:{
            type:String,
            enum:["Him",
                  "Her",
                  "Unisex",
                  "Best-seller",
                  "New-trending",
                  "Premium"
                ]
        },

        totalSold: {
          type: Number,
         default: 0
        },
        
        reviews: [reviewSchema],  
        averageRating: { type: Number, default: 0 }
    } , 
    {timestamps:true}
)

export const product = mongoose.model("product", productSchmema)
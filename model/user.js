import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        name:{
             type:String , required:true  
        },
        email:{
            type:String , required:true , unique:true
        },
        password:{
             type:String 
        },
        phoneNumber:{
             type:String
        },
        role:{
            type:String,enum:["admin", "users"],default:"users"
        },

        resetPasswordToken: String,
        resetPasswordExpires:Date,
    },{timestamps:true}
)

export const user = mongoose.model("user", userSchema)
import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"

const router = express.Router ()

router.get ("/auth/google", passport.authenticate("google",{scope:["profile", "email"], session: false, prompt:"select_account"} ))
router.get ("/auth/google/callback" , passport.authenticate("google", {session:false}),
 (req, res)=> {
    const token =jwt.sign(
        {id:req.user._id, role:req.user.role.role},
        process.env.SECRET_KEY,
        {expiresIn:"1h"}
    )


    res.redirect (`http://localhost:5173/oauth-success?token=${token}`)
 })

 export default router
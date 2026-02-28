import express from 'express'
import { creatUser, loginUsers, getAllUser ,  getUsersById, forgotPassword,resetPassword, deleteUser, userExist, updateUser} from '../controller/user.js'


const router = express.Router ()

router.post ('/', creatUser)
router.post ('/check-email', userExist)
router.post ('/reset-password', forgotPassword)
router.post ('/reset-password/:token', resetPassword)
router.get ('/', getAllUser)
router.get ('/:id', getUsersById)
router.post ('/login', loginUsers)
router.delete ('/delete/:id', deleteUser)
router.put ('/update/:id', updateUser)

export default router 
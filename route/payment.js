import express from "express";
import { initializePayment,verifyPayment } from "../controller/payment.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/initialize",auth,  initializePayment);
router.get("/verify/:reference",auth, verifyPayment);

export default router;
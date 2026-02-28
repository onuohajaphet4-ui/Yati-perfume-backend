import express from "express";
import { createOrder , getAllOrders, deleteOrder,getUserOrders, updateOrderStatus} from "../controller/order.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/create",auth, createOrder);
router.get("/", getAllOrders);
router.get("/customer",auth, getUserOrders);
router.delete ('/delete/:id', deleteOrder)
router.put("/admin/status/:id", updateOrderStatus)


export default router;
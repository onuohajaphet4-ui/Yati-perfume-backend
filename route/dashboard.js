import express from "express";
import { getDashboardStats, getCustomerDashboard} from "../controller/dashboard.js";
import auth from "../middleware/auth.js"

const router = express.Router();


router.get("/", getDashboardStats); 
router.get("/customer", auth, getCustomerDashboard);


export default router;
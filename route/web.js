import express from "express";
import { paystackWebhook } from "../controller/web.js";

const router = express.Router();

router.post("/webhook", paystackWebhook);

export default router;
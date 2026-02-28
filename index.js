import dotenv from "dotenv"
dotenv.config()
import mongoose from"mongoose";
import express from "express";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url"
import imageRoute from "./route/image.js"
import cartRoute from "./route/cart.js"
import userRoutes from './route/user.js'
// import uploadRoutes from './route/productimg.js'
import productRoutes from './route/product.js'
import paymentRoutes from './route/payment.js'
import orderRoutes from './route/order.js'
import dashRoutes from './route/dashboard.js'
import paystackRoute from "./route/web.js";
import favoriteRoutes from "./route/favorite.js"

const app = express();
app.use(express.json())
app.use(cors({
  origin: "*",
  methods:'GET,POST,PUT,DELETE',
  allowedHeaders:'Content-Type,Authorization'
}))



mongoose
  .connect(process.env.MOGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Make uploads folder public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Route
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/images", imageRoute)
app.use('/api/users', userRoutes)
app.use('/api/product', productRoutes)
// app.use('/api/upload', uploadRoutes)
app.use('/api/cart', cartRoute)
app.use('/api/payment', paymentRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/dash', dashRoutes)
app.use('/api/favorite', favoriteRoutes)
app.use("/api/paystack", express.json(), paystackRoute);

app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.send("working");
});

app.get ('/' , (req, res) => {
res.send ("hello Japhet you are cute")
})







// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { app, server} from "./lib/socket.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import couponRoutes from "./routes/coupon.js";
import paymentRoutes from "./routes/payment.js";
import analyticsRoutes from "./routes/analytics.js";


import { connectDB } from "./lib/db.js";


dotenv.config();


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);


server.listen(PORT, () => {
 console.log("Server is running on http://localhost:" + PORT);
 connectDB();
});
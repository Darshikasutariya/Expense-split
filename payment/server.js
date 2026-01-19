import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import morgan from "morgan";
import webhookRouter from "./routes/webhookRoutes.js";
import './services/paymentSubscriber.js';

const app = express();
app.use('/webhook', webhookRouter);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const PORT = process.env.PAYMENT_PORT || 5001;

app.get("/", (req, res) => {
    res.send("Payment Server is running!");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Payment Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to start payment server:", error);
    process.exit(1);
});

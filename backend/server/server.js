import dotenv from "dotenv";
dotenv.config();

// Load environment variables FIRST
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './.env.docker' });
} else {
  dotenv.config();
}


import './config/firebase.js';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import morgan from "morgan";
import indexRouter from "./routes/indexRoutes.js";
import "./cron-job/friendCron.js";
import "./cron-job/paymentRemainderCron.js";
import "./notificationqueue/worker.js";
import "./pubsub/paymentSubscriber.js";


const app = express();

// Middleware
app.use(cors(
  {
    origin: "http://localhost:5174",
    credentials: true
  }
));
app.use(express.json());
app.use(cookieParser());

// Morgan logger
app.use(morgan("dev"));

const PORT = process.env.PORT || 6001;

// Routes 
app.use("/api", indexRouter);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World - Server is running!");
});

// Connect to MongoDB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
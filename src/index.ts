import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/myUserRoutes";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/myRestaurantRoute";
import restaurantRoute from "./routes/restaurantRoute";
import orderRoute from "./routes/OrderRoute";

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to DataBase"));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express(); // creates an express server assign it to app

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
//app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://hungerhub-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);


app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json({ limit: "16kb" })); //middleware  used to parse incoming request bodies with JSON payloads.

app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoutes);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(7000, () => {
    console.log("Server started on port 7000");
});

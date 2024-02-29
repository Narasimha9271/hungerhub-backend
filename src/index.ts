import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/myUserRoutes";

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to DataBase"));

const app = express(); // creates anexpress server assign it to app
app.use(express.json({ limit: "16kb" })); //middleware  used to parse incoming request bodies with JSON payloads.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
//app.use(cookieParser());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoutes);

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(7000, () => {
    console.log("Server started on port 7000");
});

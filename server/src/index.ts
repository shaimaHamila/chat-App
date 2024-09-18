import express, { Request, Response } from "express";
import cors from "cors";
import { MongoConnect } from "../config/Database";
import AuthRouter from "../routes/AuthRouter";
import UserRouter from "../routes/UserRouter";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000", // Adjust this to match your frontend's URL
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions)); // Apply CORS with options
app.use(express.json());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello toto oooo");
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

const PORT = process.env.PORT || 5000;

MongoConnect()
  .then(() => {
    app.listen(PORT, function () {
      console.log(`server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

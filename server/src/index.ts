import express, { Request, Response } from "express";
import cors from "cors";
import chalk from "chalk";
import { MongoConnect } from "./config/Database";
import AuthRouter from "./routes/AuthRouter";
import UserRouter from "./routes/UserRouter";
import cookieParser from "cookie-parser";
import origins from "./config/Origins";
import SocketConnect from "./config/Socket";

const app = express();
const { server, io } = SocketConnect(app);
app.use(cors(origins));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

const PORT = process.env.PORT || 5000;

MongoConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(
        chalk.green(`Express is running at http://localhost:${PORT}!`)
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

//test route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "api is working fine",
  });
});

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);

export default app;

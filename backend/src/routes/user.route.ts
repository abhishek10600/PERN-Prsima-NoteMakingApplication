import express from "express";
import { registerUser } from "../controllers/user.controller";
import { validateData } from "../middlewares/validate.middleware";
import { registerUserSchema } from "../validations/user.validator";

const router = express.Router();

router.route("/register").post(validateData(registerUserSchema), registerUser);

export default router;

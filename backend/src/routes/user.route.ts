import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshToken,
} from "../controllers/user.controller";
import { validateData } from "../middlewares/validate.middleware";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/user.validator";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(validateData(registerUserSchema), registerUser);
router.route("/login").post(validateData(loginUserSchema), loginUser);

// secured routes
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").get(refreshToken);

export default router;

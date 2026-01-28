import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { createCategory } from "../controllers/category.controller";
import { validateData } from "../middlewares/validate.middleware";
import { createCategorySchema } from "../validations/category.validator";

const router = express.Router();

router
  .route("/create")
  .post(verifyJwt, validateData(createCategorySchema), createCategory);

export default router;

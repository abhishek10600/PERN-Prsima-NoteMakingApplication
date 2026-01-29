import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  createCategory,
  getCategoryByUser,
  getCategoryByIdByUser,
  updateCategoryIdByUser,
  deleteCategoryByIdByUser,
} from "../controllers/category.controller";
import { validateData } from "../middlewares/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validator";

const router = express.Router();

router
  .route("/create")
  .post(verifyJwt, validateData(createCategorySchema), createCategory);
router.route("/all").get(verifyJwt, getCategoryByUser);
router.route("/:categoryId").get(verifyJwt, getCategoryByIdByUser);
router
  .route("/:categoryId")
  .put(verifyJwt, validateData(updateCategorySchema), updateCategoryIdByUser);
router.route("/:categoryId").delete(verifyJwt, deleteCategoryByIdByUser);

export default router;

import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/validate.middleware";
import { createTodoSchema } from "../validations/todo.validator";
import { createTodo } from "../controllers/todo.controller";

const router = express.Router();

router
  .route("/create")
  .post(verifyJwt, validateData(createTodoSchema), createTodo);

export default router;

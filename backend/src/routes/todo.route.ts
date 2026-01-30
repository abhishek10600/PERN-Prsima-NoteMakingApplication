import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/validate.middleware";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validations/todo.validator";
import {
  createTodo,
  getUserTodoById,
  getUserTodos,
  updateUserTodo,
  deleteUserTodo,
  toggleIsCompleteUserTodo,
} from "../controllers/todo.controller";

const router = express.Router();

router
  .route("/create")
  .post(verifyJwt, validateData(createTodoSchema), createTodo);

router.route("/all").get(verifyJwt, getUserTodos);
router.route("/:todoId").get(verifyJwt, getUserTodoById);
router
  .route("/:todoId")
  .put(verifyJwt, validateData(updateTodoSchema), updateUserTodo);

router.route("/:todoId").delete(verifyJwt, deleteUserTodo);
router.route("/:todoId").patch(verifyJwt, toggleIsCompleteUserTodo);

export default router;

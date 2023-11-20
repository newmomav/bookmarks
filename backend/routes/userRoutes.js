import { Router } from "express";
import * as users from "../controllers/usersController.js";

const userRouter = Router();

userRouter.route("/").get(users.getAllUsers).post(users.createUser);

userRouter
  .route("/:id")
  .get(users.getUser)
  .patch(users.updateUser)
  .delete(users.deleteUser);

export default userRouter;

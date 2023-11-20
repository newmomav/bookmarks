import { Router } from "express";
import * as groups from "../controllers/groupsController.js";

const groupRouter = Router();

groupRouter
  .route("/")
  .get(groups.getAllGroups)
  .post(groups.createGroup)
  .delete(groups.deleteAllGroups);

groupRouter
  .route("/:id")
  .get(groups.getGroup)
  .patch(groups.updateGroup)
  .delete(groups.deleteGroup);

export default groupRouter;

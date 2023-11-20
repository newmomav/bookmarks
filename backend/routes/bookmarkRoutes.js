import { Router } from "express";
import * as bookmarks from "../controllers/bookmarksController.js";

const bookmarkRouter = Router();

bookmarkRouter
  .route("/")
  .get(bookmarks.getAllBookmarks)
  .post(bookmarks.createBookmark)
  .delete(bookmarks.deleteAllBookmarks);

bookmarkRouter
  .route("/:id")
  .get(bookmarks.getBookmark)
  .patch(bookmarks.updateBookmark)
  .delete(bookmarks.deleteBookmark);

export default bookmarkRouter;

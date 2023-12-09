import express from "express";
import * as postControllers from "../controllers/post.controller";

const router = express.Router();

router.post("/upload", postControllers.CreatePost);
router.get("/get-user-posts", postControllers.GetUserPosts);
router.get("/get-public-posts", postControllers.GetPublicPosts);
router.post("/update-post/:id", postControllers.UpdatePost);
router.post("/delete-post/:id", postControllers.DeletePost);
router.post("/saved-post/", postControllers.SavedPost);
router.post("/removed-post/", postControllers.RemoveSavedPost);

export default router;

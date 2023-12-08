import express from "express";
import * as postControllers from "../controllers/post.controller";

const router = express.Router();

router.post("/upload", postControllers.CreatePost);
router.get("/get-user-posts", postControllers.GetUserPosts);
router.post("/update-post/:id", postControllers.UpdatePost);

export default router;

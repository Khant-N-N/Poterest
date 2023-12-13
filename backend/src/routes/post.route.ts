import express from "express";
import * as postControllers from "../controllers/post.controller";
import * as CRControllers from "../controllers/comment_react.controller";

const router = express.Router();

router.post("/upload", postControllers.CreatePost);
router.get("/get-user-posts", postControllers.GetUserPosts);
router.get("/get-post-details/:id", postControllers.GetTargetPost);
router.get("/get-target-user-posts/:id", postControllers.GetTargetUserPosts);
router.get("/get-public-posts", postControllers.GetPublicPosts);

router.post("/update-post/:id", postControllers.UpdatePost);
router.delete("/delete-post/:id", postControllers.DeletePost);

router.post("/saved-post/", postControllers.SavedPost);
router.post("/removed-post/", postControllers.RemoveSavedPost);

router.patch("/comment", CRControllers.AddAComment);
router.patch("/reply", CRControllers.ReplyComment);
export default router;

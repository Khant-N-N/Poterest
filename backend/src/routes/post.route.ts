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

router.get("/:postId/comment", CRControllers.GetComments);
router.post("/:postId/comment", CRControllers.AddAComment);
router.delete("/:postId/comment/:commentId", CRControllers.DeleteComment);
router.post("/:postId/reply/:commentId", CRControllers.ReplyComment);

router.get("/:postId/react", CRControllers.GetReactions);
router.post("/:postId/react", CRControllers.AddReaction);

export default router;

import express from "express";
import * as postControllers from "../controllers/post.controller";

const router = express.Router();

router.post("/upload", postControllers.CreatePost);

export default router;

import express from "express";
import * as chatControllers from "../controllers/chat.controller";

const router = express.Router();

router.post("/", chatControllers.CreateChat);

export default router;

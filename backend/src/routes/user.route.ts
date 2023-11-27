import express from "express";
import * as UserControllers from "../controllers/user.controller";
import { requireAuth } from "../utils/auth";

const router = express.Router();

router.get("/", requireAuth, UserControllers.GetAuthenicatedUser);
router.post("/signup", UserControllers.SignUp);
router.post("/signin", UserControllers.SignIn);
router.post("/logout", UserControllers.LogOut);

export default router;

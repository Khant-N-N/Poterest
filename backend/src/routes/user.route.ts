import express from "express";
import * as UserControllers from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", UserControllers.SignUp);
router.post("/signin", UserControllers.SignIn);
router.post("/logout", UserControllers.LogOut);

export default router;

import express from "express";
import { login, logout, sigunp } from "../controllers/auth.js";

const router = express.Router();

router.get("/sigunp", sigunp);
router.get("/login", login );
router.get("/logout",logout );

export default router;


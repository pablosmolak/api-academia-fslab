import express from "express";
import { wrapException } from "../utils/wrapException.js";
import AuthController from "../controller/authController.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .post("/login",
        wrapException(AuthController.logar)
    )
    .get("/login/check",
        AuthMiddleware,
        wrapException(AuthController.checkInfoLogin)
    )

export default router;
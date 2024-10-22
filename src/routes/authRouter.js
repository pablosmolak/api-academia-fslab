import express from "express";
import { wrapException } from "../utils/wrapException.js";
import AuthController from "../controller/authController.js";

const router = express.Router();

router
    .post("/login", 
        wrapException(AuthController.logar)
    )

export default router;
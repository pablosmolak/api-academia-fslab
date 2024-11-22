import express from "express";
import { wrapException } from "../utils/wrapException.js";
import AuthController from "../controller/authController.js";

const router = express.Router();

router
    .post("/login", 
        wrapException(AuthController.logar)
    )
    .post("/login/github",
        wrapException(AuthController.logarGithub
        )
    )

export default router;
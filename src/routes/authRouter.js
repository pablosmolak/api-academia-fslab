import express from "express";
import { wrapException } from "../utils/wrapException.js";
import AuthValidate from "../validation/authValidation.js";
import AuthController from "../controller/authController.js";

const router = express.Router();

router
    .post("/login", wrapException(AuthValidate.loginValidate), wrapException(AuthController.logar))

export default router;

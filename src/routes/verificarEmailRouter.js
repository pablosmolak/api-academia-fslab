import express from "express";
import { wrapException } from "../utils/wrapException.js";
import VerificarEmailController from "../controller/verificarEmailController.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .post("/verificaremail", 
        AuthMiddleware,
        wrapException(VerificarEmailController.verificarEmail)
    )
    
    .post("/verificaremail/enviarcodigo", 
        AuthMiddleware,
        wrapException(VerificarEmailController.enviarCodigoVerificarEmail)
    )
    

export default router;
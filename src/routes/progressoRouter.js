
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import ProgressoController from "../controller/progressoController.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";

const router = express.Router();

router
    .get(
        "/progressos", 
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ProgressoController.listarProgresso)
    )

    .post(
        "/progressos/finalizaratividade/:conteudoid", 
        AuthMiddleware, 
        EmailVerificadoMiddleware,
        wrapException(ProgressoController.finalizarAtividade)
    )
    
export default router;  
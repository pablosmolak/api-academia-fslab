import InscricoesController from "../controller/inscricoesController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";

const router = express.Router();

router
    .post("/inscricoes",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.criarInscricao)
    )

    .get("/inscricoes",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.listarInscricoes)
    )

    .delete("/inscricoes/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.deletarInscricao)
    )

export default router;
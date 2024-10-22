import InscricoesController from "../controller/inscricoesController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .post("/inscricoes",
        AuthMiddleware,
        wrapException(InscricoesController.criarInscricao)
    )

    .get("/inscricoes",
        AuthMiddleware,
        wrapException(InscricoesController.listarInscricoes)
    )

    .delete("/inscricoes/:id",
        AuthMiddleware,
        wrapException(InscricoesController.deletarInscricao)
    )

export default router;
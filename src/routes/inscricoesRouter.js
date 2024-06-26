import InscricoesController from "../controller/inscricoesController.js";
import express from "express";
import inscricaoValidation from "../validation/inscricoesValidation.js";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .post("/inscricoes", AuthMiddleware, wrapException(inscricaoValidation.criarInscricao), wrapException(InscricoesController.criarInscricao))
    .get("/inscricoes", AuthMiddleware, wrapException(InscricoesController.listarInscricoes))
    .get("/inscricoes/:id", AuthMiddleware, wrapException(InscricoesController.listarInscricaoPorId))
    .delete("/inscricoes/:id", AuthMiddleware, wrapException(InscricoesController.deletarInscricao))

    .post("/inscricoes/:id/concluir", AuthMiddleware, wrapException(InscricoesController.concluirInscrição))

export default router;
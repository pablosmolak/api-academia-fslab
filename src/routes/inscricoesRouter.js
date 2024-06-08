import InscricoesController from "../controller/inscricoesController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";

const router = express.Router();

router
    .post("/inscricoes", wrapException(InscricoesController.criarInscricao))
    .get("/inscricoes", wrapException(InscricoesController.listarInscricoes))
    .get("/inscricoes/:id", wrapException(InscricoesController.listarInscricaoPorId))
    .delete("/inscricoes/:id", wrapException(InscricoesController.deletarInscricao))

    .post("/inscricoes/:id/concluir", wrapException(InscricoesController.concluirInscrição))

export default router;
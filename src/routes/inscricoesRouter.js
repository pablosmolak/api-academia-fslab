import InscricoesController from "../controller/inscricoesController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";

const router = express.Router();

router
    .post("/inscricoes", wrapException(InscricoesController.criarInscricao))
    .get("/inscricoes", wrapException(InscricoesController.listarInscricoes))
    .get("/inscricoes/:id")
    .delete("/inscricoes/:id")

export default router;
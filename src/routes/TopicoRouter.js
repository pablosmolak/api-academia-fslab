import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import TopicoController from "../controller/topicoController.js";

const router = express.Router();

router
    .post("/topicos", AuthMiddleware, wrapException(TopicoController.criarTopico))
    .get("/topicos/:id", AuthMiddleware,wrapException(TopicoController.listarTopicoPorID))
    .get("/topicos/curso/:cursoId", AuthMiddleware,wrapException(TopicoController.listarTopicoPorCurso))
    .patch("/topicos/:id", AuthMiddleware,wrapException(TopicoController.alterarTopico))
    .delete("/topicos/:id", AuthMiddleware, wrapException(TopicoController.deletarTopico))

export default router;


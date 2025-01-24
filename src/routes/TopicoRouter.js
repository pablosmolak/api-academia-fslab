import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import TopicoController from "../controller/topicoController.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";

const router = express.Router();

router
    .post("/topicos", 
        AuthMiddleware, 
        EmailVerificadoMiddleware,
        wrapException(TopicoController.criarTopico)
    )

    .get("/topicos/:id", 
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(TopicoController.listarTopicoPorID)
    )

    .get("/topicos/curso/:cursoid", 
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(TopicoController.listarTopicoPorCurso)
    )

    .patch("/topicos/:id", 
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(TopicoController.alterarTopico)
    )

    .delete("/topicos/:id", 
        AuthMiddleware, 
        EmailVerificadoMiddleware,
        wrapException(TopicoController.deletarTopico)
    )

export default router;


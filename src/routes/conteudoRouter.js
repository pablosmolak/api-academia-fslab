import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import ConteudoController from "../controller/conteudoController.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";

const router = express.Router();

router
    .post("/conteudos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ConteudoController.criarConteudo)
    )

    .get("/conteudos/topico/:topicoid",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ConteudoController.buscarConteudoPorTopico)
    )

    .delete("/conteudos/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ConteudoController.deletarConteudo)
    )

export default router;
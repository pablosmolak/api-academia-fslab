import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import ConteudoController from "../controller/conteudoController.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router();

router
    .post("/conteudos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(ConteudoController.criarConteudo)
    )

    .get("/conteudos/topico/:topicoid",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ConteudoController.buscarConteudoPorTopico)
    )

    .get('/conteudos/:id',
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ConteudoController.buscarConteudoPorId)
    )

    .patch('/conteudos/:id',
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(ConteudoController.alterarConteudo)
    )

    .delete("/conteudos/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(ConteudoController.deletarConteudo)
    )

export default router;
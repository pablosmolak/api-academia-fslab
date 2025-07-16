import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import TopicoController from "../controller/topicoController.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router();

router
    .post("/topicos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
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
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(TopicoController.alterarTopico)
    )

    .delete("/topicos/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(TopicoController.deletarTopico)
    )

export default router;


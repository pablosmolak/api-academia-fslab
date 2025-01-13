
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import ProgressoController from "../controller/progressoController.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router();

router
    .get(
        "/progressos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM]),
        wrapException(ProgressoController.listarProgresso)
    )

    .get(
        "/progressos/curso/:cursoId",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ProgressoController.listarProgressoDoUsuarioNoCurso)
    )

    .post(
        "/progressos/finalizaratividade/:conteudoid",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(ProgressoController.finalizarAtividade)
    )

export default router;  
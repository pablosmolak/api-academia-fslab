import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import UsuarioController from "../controller/usuarioController.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum, permissaoEnum } from "../utils/enums.js";

const router = express.Router();

router
    .post(
        "/usuarios",
        wrapException(UsuarioController.criarUsuario)
    )
    .get(
        "/usuarios",
        AuthMiddleware,
        wrapException(UsuarioController.listarUsuario)
    )

    .get(
        "/usuarios/:id",
        AuthMiddleware,
        wrapException(UsuarioController.listarUsuarioPorID)
    )

    .patch(
        "/usuarios/:id",
        AuthMiddleware,
        permissaoMiddleware([gruposEnum.ADM], [permissaoEnum.ProprioUsuario]),
        wrapException(UsuarioController.alterarUsuario)
    )

    .delete(
        "/usuarios/:id",
        AuthMiddleware,
        permissaoMiddleware([gruposEnum.ADM], [permissaoEnum.ProprioUsuario]),
        wrapException(UsuarioController.deletarUsuario)
    )

export default router;

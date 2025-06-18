import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import UsuarioController from "../controller/usuarioController.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum, permissaoEnum } from "../utils/enums.js";
import { uploadMulter } from "../middleware/multerMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";


const router = express.Router();

router
    .post(
        "/usuarios",
        wrapException(UsuarioController.criarUsuario)
    )

    .post(
        "/usuarios/:id/image/upload", 
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM], [permissaoEnum.ProprioUsuario]),
        uploadMulter,
        wrapException(UsuarioController.uploadFotoPerfil)
    )
    
    .delete(
        "/usuarios/:id/image/delete", 
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM], [permissaoEnum.ProprioUsuario]),
        wrapException(UsuarioController.deletarFotoPerfil)
    )

    .get(
        "/usuarios",
        wrapException(UsuarioController.listarUsuario)
    )

    .get(
        "/usuarios/:id",
        wrapException(UsuarioController.listarUsuarioPorID)
    )

    .get(
        "/usuarios/:id/image",
        wrapException(UsuarioController.visualizarImagem)
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
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { GrupoMiddleware } from "../middleware/GrupoMiddleware.js";
import UsuarioController from "../controller/usuarioController.js";
import usuarioValidation from "../validation/usuarioValidation.js";

const router = express.Router();

router
    .post("/usuarios", wrapException(usuarioValidation.criarUsuario), wrapException(UsuarioController.criarUsuario))
    .get("/usuarios", AuthMiddleware, GrupoMiddleware("USUARIO_LISTAR"),wrapException(UsuarioController.listarUsuario))
    .get("/usuarios/:id", AuthMiddleware,  GrupoMiddleware("USUARIO_LISTAR"), wrapException(usuarioValidation.buscarUsuario), wrapException(UsuarioController.listarUsuarioPorID))
    .patch("/usuarios/:id", AuthMiddleware,  GrupoMiddleware("USUARIO_ALTERAR"), wrapException(usuarioValidation.alterarUsuario), wrapException(UsuarioController.alterarUsuario))
    .delete("/usuarios/:id", AuthMiddleware,  GrupoMiddleware("USUARIO_DELETAR"), wrapException(usuarioValidation.deletarUsuario), wrapException(UsuarioController.deletarUsuario))

export default router;

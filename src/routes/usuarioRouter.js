import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import UsuarioController from "../controller/usuarioController.js";

const router = express.Router();

router
    .post("/usuarios", wrapException(UsuarioController.criarUsuario))
    .get("/usuarios", AuthMiddleware, wrapException(UsuarioController.listarUsuario))
    .get("/usuarios/:id", AuthMiddleware, wrapException(UsuarioController.listarUsuarioPorID))
    .patch("/usuarios/:id", AuthMiddleware, wrapException(UsuarioController.alterarUsuario))
    .delete("/usuarios/:id", AuthMiddleware, wrapException(UsuarioController.deletarUsuario))

export default router;

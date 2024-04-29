import UsuarioController from "../controller/usuarioController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import usuarioValidation from "../validation/usuarioValidation.js";


const router = express.Router();

router
    .post("/usuarios", wrapException(usuarioValidation.criarUsuario), wrapException(UsuarioController.criarUsuario))
    .get("/usuarios", wrapException(UsuarioController.listarUsuario))
    .get("/usuarios/:id", wrapException(UsuarioController.listarUsuarioPorID))
    .delete("/usuarios/:id", wrapException(UsuarioController.deletarUsuario))

export default router;

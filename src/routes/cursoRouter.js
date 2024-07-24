import CursosController from "../controller/cursosController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .post("/cursos", AuthMiddleware, wrapException(CursosController.criarCurso))
    .get("/cursos", AuthMiddleware, wrapException(CursosController.listarCursos))
    .get("/cursos/:id", AuthMiddleware, wrapException(CursosController.listarCursoPorId))
    .delete("/cursos/:id", AuthMiddleware, wrapException(CursosController.deletarCurso))

    .get("/inscricoes/usuarios/:usuarioID", wrapException(CursosController.listarCursosInscritosPorUsuario))

export default router;  
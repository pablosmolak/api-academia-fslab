import CursosController from "../controller/cursosController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import cursoValidation from "../validation/cursoValidation.js";

const router = express.Router();

router
    .post("/cursos", wrapException(cursoValidation.criarCurso), wrapException(CursosController.criarCurso))
    .get("/cursos", wrapException(CursosController.listarCursos))
    .get("/cursos/:id", wrapException(CursosController.listarCursoPorId))
    .delete("/cursos/:id", wrapException(CursosController.deletarCurso))


    .get("/usuarios/:usuarioID/cursos", wrapException(CursosController.listarCursosPorUsuario))

export default router;  
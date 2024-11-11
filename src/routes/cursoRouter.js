import CursosController from "../controller/cursosController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { uploadMulter } from "../middleware/multerMiddleware.js";

const router = express.Router();

router
    .post("/cursos",
        AuthMiddleware,
        wrapException(CursosController.criarCurso)
    )

    .get("/cursos",
        AuthMiddleware,
        wrapException(CursosController.listarCursos)
    )

    .get("/cursos/:id",
        AuthMiddleware,
        wrapException(CursosController.listarCursoPorId)
    )

    .delete("/cursos/:id",
        AuthMiddleware,
        wrapException(CursosController.deletarCurso)
    )

    .get("/cursos/informacoes/:cursoid",
        wrapException(CursosController.listarInformacoesCurso)
    )

    .get("/cursos/inscricoes/usuario/:usuarioid",
        wrapException(CursosController.listarCursosInscritosPorUsuario)
    )

    .get("/cursos/:id/instrutores",
        wrapException(CursosController.listarInstrutoresDoCurso)
    )
    .post("/cursos/:id/instrutores",
        wrapException(CursosController.adicionarInstrutores)
    )

    .post(
        "/cursos/:id/capa/upload", 
        AuthMiddleware,
        uploadMulter,
        wrapException(CursosController.uploadCapa)
    )

    .get(
        "/cursos/:id/capa",
        wrapException(CursosController.visualizarCapa)
    )

export default router;  
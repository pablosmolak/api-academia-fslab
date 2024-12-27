import CursosController from "../controller/cursosController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { uploadMulter } from "../middleware/multerMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";

const router = express.Router();

router
    .post("/cursos",
        AuthMiddleware,
           EmailVerificadoMiddleware,
        wrapException(CursosController.criarCurso)
    )

    .get("/cursos",
        wrapException(CursosController.listarCursos)
    )

    .get("/cursos/:id",
        wrapException(CursosController.listarCursoPorId)
    )

    .delete("/cursos/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CursosController.deletarCurso)
    )

    .get("/cursos/informacoes/:cursoid",
        wrapException(CursosController.listarInformacoesCurso)
    )

    .get("/cursos/inscricoes/usuario/:usuarioid",
        wrapException(CursosController.listarCursosInscritosPorUsuario)
    )

    .get("/cursos/:id/instrutores",
        AuthMiddleware,
        EmailVerificadoMiddleware,
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
import CursosController from "../controller/cursosController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { uploadMulter } from "../middleware/multerMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router();

router
    .post("/cursos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CursosController.criarCurso)
    )

    .get("/cursos/publicados",
        wrapException(CursosController.listarCursosPublicados)
    )

    .get("/cursos/publicados/:id",
        wrapException(CursosController.listarCursoPublicadoPorId)
    )
    
    .patch("/cursos/alterarstatus/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CursosController.alterarStatusCurso)
    )

    
    .get("/cursos/todos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CursosController.listarTodosCursos)
    )
    
    .get("/cursos/todos/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CursosController.listarTodosCursosPorId)
    )

    .delete("/cursos/:id",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CursosController.deletarCurso)
    )

    .get("/cursos/publicados/informacoes/:cursoid",
        wrapException(CursosController.listarInformacoesCurso)
    )

    .get("/cursos/inscricoes/usuario/:usuarioid",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CursosController.listarCursosInscritosPorUsuario)
    )

    .get("/cursos/:id/instrutores",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CursosController.listarInstrutoresDoCurso)
    )
    .post("/cursos/:id/instrutores",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CursosController.adicionarInstrutores)
    )

    .post(
        "/cursos/:id/capa/upload",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        uploadMulter,
        wrapException(CursosController.uploadCapa)
    )

    .get(
        "/cursos/:id/capa",
        wrapException(CursosController.visualizarCapa)
    )

export default router;  
import InscricoesController from "../controller/inscricoesController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";

const router = express.Router();

router
    .post("/inscricoes",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.criarInscricao)
    )

    .get("/inscricoes",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(InscricoesController.listarInscricoes)
    )

    .get("/inscricoes/usuario",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.listarInscricoesDoUsuarioLogado)
    )
    
    .get("/inscricoes/usuario/curso/:cursoId",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.listarInscricoesDoUsuarioLogadoPorIdDeCurso)
    )

    .delete("/inscricoes/usuario/curso/:cursoId",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(InscricoesController.deletarInscricaoDoUsuarioLogadoPorIdDeCurso)
    )

export default router;
import CertificadoController from "../controller/certificadoController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router();

router
    .get("/certificados",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM, gruposEnum.Professores]),
        wrapException(CertificadoController.listarCertificados)
    )

    .get("/certificados/usuario",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CertificadoController.listarCertificadosDoUsuarioLogado)
    )

    .get("/certificados/usuario/curso/:cursoId",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CertificadoController.listarCertificadosDoCursoDoUsuarioLogado)
    )

    .get("/certificados/validar/:validador",
        wrapException(CertificadoController.validarCertificado)
    )

export default router;
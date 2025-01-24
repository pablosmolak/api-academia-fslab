import CertificadoController from "../controller/certificadoController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";

const router = express.Router();

router
    .get("/certificados",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CertificadoController.listarCertificados)
    )

    .get("/certificados/usuario/:userId",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        wrapException(CertificadoController.listarCertificadosDoUsuario)
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
import CertificadoController from "../controller/certificadoController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";

const router = express.Router();

router
    .get("/certificados", wrapException(CertificadoController.listarCertificados))
    .get("/certificados/usuario/:usuarioid", wrapException(CertificadoController.listarCertificadosDoUsuario))
    .get("/certificados/validar/:validador", wrapException(CertificadoController.validarCertificado))
    
export default router;
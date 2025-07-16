import express from "express";
import GruposController from "../controller/gruposController.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { EmailVerificadoMiddleware } from "../middleware/EmailVerificadoMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { wrapException } from "../utils/wrapException.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router()

router
    .get("/grupos",
        AuthMiddleware,
        EmailVerificadoMiddleware,
        permissaoMiddleware([gruposEnum.ADM]),
        wrapException(GruposController.buscarGrupos)
    )

export default router
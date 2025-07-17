import express from "express"
import RecuperaSenhaController from "../controller/recuperaSenhaController.js"
import { wrapException } from "../utils/wrapException.js";

const router = express.Router()

router
    .post("/recuperarsenha",
        wrapException(RecuperaSenhaController.recuperaSenha)
    )

    .post("/alterarsenha",
        wrapException(RecuperaSenhaController.alteraSenha)
    )

export default router
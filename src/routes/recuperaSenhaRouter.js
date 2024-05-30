import express from "express"
import RecuperaSenhaController from "../controller/recuperaSenhaController.js"
import recuperaSenhaValidation from "../validation/recuperaSenhaValidation.js"
import { wrapException } from "../utils/wrapException.js";

const router = express.Router()

router
    .post("/recuperarsenha", wrapException(recuperaSenhaValidation.recuperaSenhaValidate), wrapException(RecuperaSenhaController.recuperaSenha))
//.post("/alterarsenha", recuperaSenhaValidation.alteraSenhaValidate, RecuperaSenhaController.alteraSenha)

export default router
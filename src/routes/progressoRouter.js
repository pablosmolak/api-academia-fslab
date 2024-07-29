
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import ProgressoController from "../controller/progressoController.js";

const router = express.Router();

router
    .get("/progressos", AuthMiddleware, wrapException(ProgressoController.listarProgresso))
    .post("/progressos/finalizaratividade/:conteudoid", AuthMiddleware, wrapException(ProgressoController.finalizarAtividade))
    
export default router;  
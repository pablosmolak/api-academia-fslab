import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import ConteudoController from "../controller/conteudoController.js";

const router = express.Router();

router
    .post("/conteudos", 
        AuthMiddleware, 
        wrapException(ConteudoController.criarConteudo)
    )

    .get("/conteudos/topico/:topicoid", 
        AuthMiddleware, 
        wrapException(ConteudoController.buscarConteudoPorTopico)
    )

    .delete("/conteudos/:id", 
        AuthMiddleware, 
        wrapException(ConteudoController.deletarConteudo)
    )

export default router;
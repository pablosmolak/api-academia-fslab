import CategoriaController from "../controller/categoriaController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { permissaoMiddleware } from "../middleware/permissaoMiddleware.js";
import { gruposEnum } from "../utils/enums.js";

const router = express.Router();

router
    .post(
        "/categorias",
        AuthMiddleware,
        permissaoMiddleware(gruposEnum.ADM, gruposEnum.Professores),
        wrapException(CategoriaController.criarCategoria)
    )

    .get("/categorias",
        AuthMiddleware,
        wrapException(CategoriaController.listarCategorias)
    )

    .get("/categorias/:id",
        AuthMiddleware,
        wrapException(CategoriaController.listarCategoriasPorID)
    )

    .patch("/categorias/:id",
        AuthMiddleware,
        permissaoMiddleware(gruposEnum.ADM, gruposEnum.Professores),
        wrapException(CategoriaController.alterarCategoria)
    )

    .delete("/categorias/:id",
        AuthMiddleware,
        permissaoMiddleware(gruposEnum.ADM, gruposEnum.Professores),
        wrapException(CategoriaController.deletarCategoria)
    )

export default router;
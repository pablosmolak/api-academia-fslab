import CategoriaController from "../controller/categoriaController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import categoriaValidation from "../validation/categoriaValidation.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .post("/categorias", AuthMiddleware, wrapException(categoriaValidation.criarCategoria), wrapException(CategoriaController.criarCategoria))
    .get("/categorias", AuthMiddleware, wrapException(CategoriaController.listarCategorias))
    .get("/categorias/:id", AuthMiddleware, wrapException(categoriaValidation.buscarCategoriaPorID), wrapException(CategoriaController.listarCategoriasPorID))
    .patch("/categorias/:id", AuthMiddleware, wrapException(categoriaValidation.alterarCategoria), wrapException(CategoriaController.alterarCategoria))
    .delete("/categorias/:id", AuthMiddleware, wrapException(categoriaValidation.deletarCategoria), wrapException(CategoriaController.deletarCategoria))

export default router;


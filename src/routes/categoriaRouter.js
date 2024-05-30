import CategoriaController from "../controller/categoriaController.js";
import express from "express";
import { wrapException } from "../utils/wrapException.js";
import categoriaValidation from "../validation/categoriaValidation.js";

const router = express.Router();

router
    .post("/categorias", wrapException(categoriaValidation.criarCategoria), wrapException(CategoriaController.criarCategoria))
    .get("/categorias", wrapException(CategoriaController.listarCategorias))
// .get("/categorias/:id", wrapException(CategoriaController.listarCategoriaPorID))
// .delete("/categorias/:id", wrapException(CategoriaController.deletarCategoria))

export default router;


import logRoutes from "../middleware/logRoutesMiddleware.js";
import usuarios from "./usuarioRouter.js";
import cursos from "./cursoRouter.js";
import categoria from "./categoriaRouter.js";
import auth from "./authRouter.js";
import recuperarsenha from "./recuperaSenhaRouter.js";
import inscricoes from "./inscricoesRouter.js";
import certificados from "./certificadoRouter.js";

const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.status(200).redirect("/docs")
    })

    app.use(
        usuarios,
        cursos,
        categoria,
        auth,
        usuarios,
        recuperarsenha,
        inscricoes,
        certificados
    )
}

export default routes;
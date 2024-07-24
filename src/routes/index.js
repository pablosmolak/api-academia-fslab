import logRoutes from "../middleware/logRoutesMiddleware.js";
import categorias from "./categoriaRouter.js";
import auth from "./authRouter.js";
import topicos from "./TopicoRouter.js";
import usuarios from "./usuarioRouter.js";
import conteudos from "./conteudoRouter.js";
import cursos from "./cursoRouter.js";
import inscricoes from "./inscricoesRouter.js";


const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.status(200).redirect("/docs")
    })

    app.use(
        auth,
        categorias,
        topicos,
        usuarios,
        conteudos,
        cursos,
        inscricoes
    )
}

export default routes;
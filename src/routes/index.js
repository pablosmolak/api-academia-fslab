import logRoutes from "../middleware/logRoutesMiddleware.js";
import categorias from "./categoriaRouter.js";
import auth from "./authRouter.js";
import topicos from "./TopicoRouter.js";
import usuarios from "./usuarioRouter.js";
import conteudos from "./conteudoRouter.js";
import cursos from "./cursoRouter.js";
import inscricoes from "./inscricoesRouter.js";
import progressos from "./progressoRouter.js";
import certificados from "./certificadoRouter.js";
import recuperarsenha from "./recuperaSenhaRouter.js";
import verificaremail from "./verificarEmailRouter.js";
import grupos from "./grupoRouter.js";

const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.redirect(301, "/docs");
    })

    app.use(
        auth,
        recuperarsenha,
        verificaremail,
        usuarios,
        grupos,
        categorias,
        topicos,
        conteudos,
        cursos,
        inscricoes,
        progressos,
        certificados
    )
}

export default routes;
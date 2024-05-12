import usuarios from "./usuarioRouter.js";
import cursos from "./cursoRouter.js";
import categoria from "./categoriaRouter.js";
import logRoutes from "../middleware/logRoutesMiddleware.js";

const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.status(200).redirect("/docs")
    });

    app.use(
        usuarios,
        cursos,
        categoria
    );

    
};

export default routes;

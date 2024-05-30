import logRoutes from "../middleware/logRoutesMiddleware.js";
import usuarios from "./usuarioRouter.js";
import auth from "./authRouter.js";
import recuperarsenha from "./recuperaSenhaRouter.js";

const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.status(200).redirect("/docs")
    });

    app.use(
        auth,
        usuarios,
        recuperarsenha
    );

    
};

export default routes;

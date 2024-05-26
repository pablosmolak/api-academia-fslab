import usuarios from "./usuarioRouter.js";
import auth from "./authRouter.js";
import logRoutes from "../middleware/logRoutesMiddleware.js";

const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.status(200).redirect("/docs")
    });

    app.use(
        auth,
        usuarios
    );

    
};

export default routes;

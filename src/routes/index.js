import usuarios from "./usuarioRouter.js";
import logRoutes from "../middleware/logRoutesMiddleware.js";

const routes = (app) => {

    if (process.env.DEBUGLOG === "true") {
        app.use(logRoutes);
    }

    app.route("/").get((req, res) => {
        res.status(200).redirect("/docs")
    });

    app.use(
        usuarios
    );
};

export default routes;

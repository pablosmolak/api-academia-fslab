import cors from 'cors';
import express from 'express';
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes(app);

app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        const methods = Object.keys(middleware.route.methods)
            .map(m => m.toUpperCase())
            .join(', ');
        console.log(`📌 Rota encontrada: [${methods}] ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                const methods = Object.keys(handler.route.methods)
                    .map(m => m.toUpperCase())
                    .join(', ');
                console.log(`📌 Rota encontrada: [${methods}] ${handler.route.path}`);
            }
        });
    }
});

export default app;
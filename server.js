import * as dotenv from 'dotenv';
import { verifyConnection } from "./src/config/prismaClient.js";
import app from "./src/app.js"
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerOptions from './src/docs/config/head.js';
import { verificarAdministradorPadrao, verificarGrupos, verificarMinio } from "./src/config/initialConfig.js";
import { sendError } from './src/utils/mensagens.js';

dotenv.config();

const port = process.env.PORT || 3010;

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));

app.use((req, res) => {
    return sendError(res, 404, "Rota não encontrada!")
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return sendError(res,400,'JSON malformado. Por favor, verifique a sintaxe.' )
    }
    next();
});

app.listen(port, async () => {
    await verifyConnection()
    await verificarGrupos()
    await verificarAdministradorPadrao()
    await verificarMinio()
    console.log(`Servidor Rodando em http://localhost:${port}`)
});

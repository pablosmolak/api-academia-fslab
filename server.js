import { prisma, verifyConnection } from "./src/config/prismaClient.js";
import app from "./src/app.js"
import swaggerUI from 'swagger-ui-express'; 
import swaggerJsDoc from 'swagger-jsdoc';  
import swaggerOptions from './src/docs/config/head.js'; 
import * as dotenv from 'dotenv';
import { verificarAdministradorPadrao, verificarGrupos } from "./src/config/initialConfig.js";

dotenv.config();

const port = process.env.PORT || 3010;

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));

app.use((req, res) => {
    res.status(404).json({ code: 404, mensagem: 'Página não encontrada' });
});

app.listen(port, async () => {
    await verifyConnection()
    await verificarGrupos()
    await verificarAdministradorPadrao()
    console.log(`Servidor Rodando em http://localhost:${port}`)
});

import { PrismaClient } from "@prisma/client";
import { zodConfig } from "./zodConfig.js";

zodConfig();


// Iniciando o Prisma Client com opções de conexão
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DB_URL, 
        },
    },
    errorFormat: "minimal", // Define o formato de erro, pode ser "pretty", "colorless" ou "minimal"
   // log: [/*"query",*/ "info", "warn", "error"], // Loga as consultas e erros
});

// Função para verificar a conexão com o banco de dados
export async function verifyConnection() {
    try {
        // Tenta acessar o banco de dados
        await prisma.$connect();
        console.log("Conectado ao banco de dados com sucesso!");
    } catch (error) {
        // Se houver um erro, ele será capturado aqui
        console.error("Erro ao conectar ao banco de dados:", error);
        process.exit(1); // Encerra o processo com código de erro
    }
}

export { prisma };
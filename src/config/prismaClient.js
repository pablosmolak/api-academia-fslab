import { PrismaClient } from "@prisma/client";
import { zodConfig } from "./zodConfig.js";
import * as dotenv from 'dotenv';

dotenv.config()

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
        console.log("\n✅ Conectado ao banco de dados com sucesso!");
    } catch (error) {
        // Se houver um erro, ele será capturado aqui
        console.error("\n❌ Erro ao conectar ao banco de dados:", error);
        console.log(error)
        console.log(process.env.DB_URL)
        process.exit(1); // Encerra o processo com código de erro
    }
}

export { prisma };
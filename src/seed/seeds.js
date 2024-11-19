import "dotenv/config";
import { prisma } from "../config/prismaClient.js";
import categoriaSeed from "./categoriaSeed.js";
import gruposSeed from "./grupoSeed.js";
import imagemSeed from "./imagemSeed.js";
import cursoSeed from "./cursoSeed.js";
import usuarioSeed from "./usuarioSeed.js";
import instrutorSeed from "./instrutorSeed.js";

await prisma.instrutores.deleteMany()
await prisma.curso.deleteMany()
await prisma.categoria.deleteMany();
await prisma.usuario.deleteMany()
await prisma.grupo.deleteMany();

await gruposSeed()
await imagemSeed(100)
await usuarioSeed(50)
await categoriaSeed()
await cursoSeed(100)
instrutorSeed()
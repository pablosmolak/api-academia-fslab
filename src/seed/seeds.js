import "dotenv/config";
import { prisma } from "../config/prismaClient.js";
import categoriaSeed from "./categoriaSeed.js";
import gruposSeed from "./grupoSeed.js";
import imagemSeed from "./imagemSeed.js";
import cursoSeed from "./cursoSeed.js";
import usuarioSeed from "./usuarioSeed.js";
import instrutorSeed from "./instrutorSeed.js";
import topicoSeed from "./topicoSeed.js";
import conteudoSeed from "./conteudoSeed.js";

// await prisma.certificado.deleteMany()
// await prisma.progressoCurso.deleteMany()
// await prisma.inscricao.deleteMany(); 
// await prisma.conteudoCurso.deleteMany();
// await prisma.topico.deleteMany();
// await prisma.instrutores.deleteMany()
await prisma.curso.deleteMany()
await prisma.categoria.deleteMany();
await prisma.usuario.deleteMany()
await prisma.grupo.deleteMany();

await gruposSeed()
await imagemSeed()
await usuarioSeed()
await categoriaSeed()
await cursoSeed()
// await instrutorSeed()
// await topicoSeed(4)
// await conteudoSeed(5)
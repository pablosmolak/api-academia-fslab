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

await prisma.progressoCurso.deleteMany()
await prisma.inscricao.deleteMany(); 
await prisma.conteudoCurso.deleteMany();
await prisma.topico.deleteMany();
await prisma.instrutores.deleteMany()
await prisma.curso.deleteMany()
await prisma.categoria.deleteMany();
await prisma.usuario.deleteMany()
await prisma.grupo.deleteMany();

await gruposSeed()
await imagemSeed(5)
await usuarioSeed(20)
await categoriaSeed()
await cursoSeed(20)
await instrutorSeed()
await topicoSeed(5)
await conteudoSeed(5)
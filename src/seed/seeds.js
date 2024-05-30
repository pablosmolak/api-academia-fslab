import { prisma } from "../config/prismaClient.js";
import gruposSeed from "./grupoSeed.js";


await prisma.regras_Grupo.deleteMany({});
await prisma.grupo.deleteMany({});
await prisma.regra.deleteMany({});
gruposSeed()
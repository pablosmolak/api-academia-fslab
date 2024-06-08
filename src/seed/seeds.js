import { prisma } from "../config/prismaClient.js";
import gruposSeed from "./grupoSeed.js";



await prisma.grupo.deleteMany({});
gruposSeed()
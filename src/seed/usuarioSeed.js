import bcrypt from "bcryptjs";
import faker from 'faker-br';
import { verificarAdministradorPadrao } from "../config/initialConfig.js";
import { prisma } from "../config/prismaClient.js";
import { gruposEnum } from "../utils/enums.js";
import dataSeed from "./data.js";

export default async function usuarioSeed(qtd) {

    await verificarAdministradorPadrao()

    const grupoProfessor = await prisma.grupo.findFirst({
        where: {
            nome: gruposEnum.Professores
        }
    });

    const grupoid = grupoProfessor.id;

    const usuarios = []

    for (let index = 0; index < dataSeed.length; index++) {
        await prisma.usuario.create({
           data:{
            id: dataSeed[index].canal_infos.id,
            nome: dataSeed[index].canal_infos.nome_do_canal,
            senha: bcrypt.hashSync("Dev@1234", 10),
            email: faker.internet.email(),
            fotoPerfil: `${dataSeed[index].canal_infos.id}.jpg`,
            grupoId: grupoid
           }
        })
    }

    console.log(`Foram criados ${dataSeed.length} de usuários!`);
}
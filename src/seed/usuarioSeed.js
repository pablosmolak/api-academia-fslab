import { verificarAdministradorPadrao } from "../config/initialConfig.js";
import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import { gruposEnum } from "../utils/enums.js";
import faker from 'faker-br';

export default async function usuarioSeed(qtd) {

    await verificarAdministradorPadrao()

    const grupos = await prisma.grupo.findMany({
        where: {
            nome: {
                in: [gruposEnum.Alunos, gruposEnum.Professores]
            }
        }
    });

    const gruposid = grupos.map(grupo => grupo.id)

    console.log(gruposid)

    const usuarios = []
    for (let index = 0; index < qtd; index++) {
        const senha = "Dev@1234"
        const email = faker.internet.email();

        usuarios.push({
            nome: `${faker.name.firstName()} ${faker.name.lastName()}`,
            senha: bcrypt.hashSync(senha, 10),
            email,
            grupoId: faker.random.arrayElement(gruposid)
        })

        if (usuarios.length === 1000 || index === qtd - 1) {
            await prisma.usuario.createMany({
                data: usuarios
            })

            console.log(`${usuarios.length} usuários criados!`)
            usuarios.length = 0; // Limpar o array para o próximo lote
        }
    }

    console.log(`Foram criados ${qtd} de usuários!`);
}
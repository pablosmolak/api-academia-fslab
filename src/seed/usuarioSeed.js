import { verificarAdministradorPadrao } from "../config/initialConfig.js";
import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import { bucketsMinio, gruposEnum } from "../utils/enums.js";
import faker from 'faker-br';
import minioConfig from "../config/minioConfig.js";

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
    
    const imagens = [];
    const objetos = minioConfig.listObjectsV2(bucketsMinio.Usuarios, "", true); // Garantir que aguarda a resposta do MinIO

    for await (const objeto of objetos) {
        imagens.push(objeto.name);
    }

    const usuarios = []
    for (let index = 0; index < qtd; index++) {
        usuarios.push({
            nome: `${faker.name.firstName()} ${faker.name.lastName()}`,
            senha: bcrypt.hashSync("Dev@1234", 10),
            email: faker.internet.email(),
            fotoPerfil: imagens.length > 0 ? faker.random.arrayElement(imagens) : null,
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
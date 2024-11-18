import { prisma } from "../config/prismaClient.js";
import faker from 'faker-br';

export default async function instrutorSeed() {

    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
        },
    })
    const cursos = await prisma.curso.findMany({
        select: {
            id: true,
        },
    })

    const usuariosid = usuarios.map((usuario) => usuario.id)
    const cursosid = cursos.map((curso) => curso.id)

    const instrutores = []
    for (let index = 0; index < cursosid.length; index++) {


        instrutores.push({
            cursoId: cursosid[index],
            userId: faker.random.arrayElement(usuariosid)
        })

        if (instrutores.length === 1000 || index === (cursosid.length - 1)) {
            await prisma.instrutores.createMany({
                data: instrutores
            })

            console.log(`${instrutores.length} instrutores criados!`)
            instrutores.length = 0; // Limpar o array para o próximo lote
        }
    }

    console.log(`Foram criados ${cursosid.length} instrutores!`);
}
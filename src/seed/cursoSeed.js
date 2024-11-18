import faker from 'faker-br';
import minioConfig from "../config/minioConfig.js";
import { prisma } from "../config/prismaClient.js";
import { bucketsMinio } from "../utils/enums.js";
export default async function cursoSeed(qtd = 0) {
    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
        },
    });

    const categorias = await prisma.categoria.findMany({
        select: {
            id: true,
        }
    });

    const imagens = [];
    const objetos = minioConfig.listObjectsV2(bucketsMinio.Cursos, "", true); // Garantir que aguarda a resposta do MinIO

    for await (const objeto of objetos) {
        imagens.push(objeto.name);
    }

    const cursos = [];
    for (let index = 0; index < qtd; index++) {

        const categoriasSelecionadas = faker.helpers.shuffle(categorias)
            .slice(0, 2 + Math.floor(Math.random() * (categorias.length - 2))); 

        const novoCurso = await prisma.curso.create({
            data: {
                nome: faker.company.companyName(),
                descricao: faker.lorem.paragraphs(2),
                capa: imagens.length > 0 ? faker.random.arrayElement(imagens) : null,
                criador: faker.random.arrayElement(usuarios).id,
                categoria: { // Usando o campo de relacionamento
                    connect: categoriasSelecionadas.map((categoria) => ({ id: categoria.id })),
                },
            },
        });

        cursos.push(novoCurso);

        if (cursos.length === 1000 || index === qtd - 1) {
            console.log(`${cursos.length} cursos criados.`);
            cursos.length = 0; // Limpar o array para o próximo lote
        }
    }

    console.log(`${qtd} cursos Criados`);
}

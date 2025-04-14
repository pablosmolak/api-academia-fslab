import faker from 'faker-br';
import minioConfig from "../config/minioConfig.js";
import { prisma } from "../config/prismaClient.js";
import { bucketsMinio, gruposEnum } from "../utils/enums.js";
export default async function cursoSeed(qtd = 0) {
    const cursosTecnologia = [
        "Desenvolvimento Web",
        "Desenvolvimento Mobile",
        "Data Science",
        "Machine Learning",
        "Inteligência Artificial",
        "DevOps",
        "Cybersegurança",
        "Engenharia de Software",
        "Administração de Banco de Dados",
        "Análise de Dados",
        "Blockchain",
        "Internet das Coisas (IoT)",
        "Cloud Computing",
        "Game Development",
        "UX/UI Design",
        "Automação de Testes",
        "Redes de Computadores",
        "Programação com Python",
        "Programação com JavaScript",
        "Arquitetura de Software",
        "Gestão de Projetos Ágeis",
        "Big Data",
        "Desenvolvimento com React",
        "Desenvolvimento com Angular",
        "Desenvolvimento com Vue.js",
        "Programação com Java",
        "Programação com C#",
        "Programação com Kotlin",
        "Segurança em Aplicações Web",
        "Virtualização e Containers",
        "Inteligência de Negócios (BI)",
        "Administração de Sistemas Linux",
        "Criação de Chatbots",
        "Processamento de Imagens",
        "Robótica",
        "Realidade Virtual e Aumentada",
        "Computação Gráfica",
        "Automação de Processos com RPA",
        "Design Thinking",
        "Teste de Software Manual e Automatizado"
    ];

    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
        },
        where: {
            Grupo: {
                nome: {
                    in: [gruposEnum.ADM,gruposEnum.Professores], 
                }
            }
        }
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
                nome: faker.random.arrayElement(cursosTecnologia),
                descricao: faker.lorem.paragraphs(2),
                capa: imagens.length > 0 ? faker.random.arrayElement(imagens) : null,
                cargaHoraria: 5000,
                publicado: true,
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

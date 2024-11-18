import { prisma } from "../config/prismaClient.js";

export default async function categoriaSeed() {

    const tags = [
        "Desenvolvimento Web",
        "Inteligência Artificial",
        "Machine Learning",
        "Data Science",
        "Desenvolvimento de Software",
        "Cloud Computing",
        "Programação em Python",
        "Cibersegurança",
        "Blockchain",
        "Desenvolvimento Mobile",
        "Banco de Dados",
        "Big Data",
        "IoT",
        "DevOps",
        "Automação de Testes",
        "Programação Orientada a Objetos",
        "Computação em Nuvem",
        "Redes de Computadores",
        "Design de UX/UI",
        "Realidade Aumentada",
        "Realidade Virtual",
        "Agilidade e Scrum",
        "Testes de Software",
        "Engenharia de Software",
        "Análise de Dados",
        "AWS",
        "Azure",
        "Google Cloud",
        "RPA",
        "Python para Dados"
    ]

    const categoriasCriadas = await prisma.categoria.createMany({
        data: tags.map(nome => ({
            nome
        }))
    });

    console.log(categoriasCriadas.count + " categorias criadas!");
}
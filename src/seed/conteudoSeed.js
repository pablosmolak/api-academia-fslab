import { prisma } from "../config/prismaClient.js";
import faker from 'faker-br';
import { tiposConteudosEnum } from "../utils/enums.js";

export default async function conteudoSeed(qtdConteudoTopicos) {

    const conteudosTitulo = [
        "Entendendo os Conceitos de Programação",
        "Criando um Site com HTML e CSS Básico",
        "Manipulando o DOM com JavaScript",
        "Construindo APIs REST com Node.js",
        "Componentes Reutilizáveis no React",
        "Consultando Bancos com SQL Básico",
        "Introdução ao MongoDB: Collections e Queries",
        "Conceitos de Ciência de Dados na Prática",
        "Visualizando Dados com Python e Matplotlib",
        "Implementando Regressão Linear com Python",
        "Automatizando Processos com Docker",
        "Criando Containers no Docker Passo a Passo",
        "Entendendo Firewalls e Criptografia",
        "Desenvolvendo Apps Básicos no Flutter",
        "Criando Interfaces no React Native",
        "Fundamentos de Redes e TCP/IP",
        "Configuração de Redes em Ambiente Virtual",
        "Automatizando Testes com Selenium",
        "Criando Bots Inteligentes para Chat",
        "Introdução ao Controle de Versão com Git",
        "Implementando Algoritmos de Busca",
        "Criando APIs GraphQL com Apollo Server",
        "Configurando Jenkins para Integração Contínua",
        "Aplicando UX Design em Projetos Mobile",
        "Desenvolvendo Jogos em Unity Básico",
        "Construindo Interfaces com Vue.js",
        "Entendendo o TypeScript no Frontend",
        "Criando Microservices Escaláveis",
        "Iniciando com Big Data e Spark",
        "Extraindo Dados da Web com Web Scraping",
        "Utilizando NLP para Classificação de Texto",
        "Construindo Redes Neurais com TensorFlow",
        "Introdução ao Test-Driven Development",
        "Criando Sistemas de Login Seguros",
        "Gerenciando Projetos Ágeis com Scrum",
        "Deploy de Aplicações na AWS",
        "Aplicando Técnicas de SEO em Websites",
        "Criando Extensões para o Google Chrome",
        "Programando para Dispositivos IoT",
        "Análise de Sentimentos em Redes Sociais",
        "Desenvolvendo Aplicações para Smart TVs",
        "Testando Performance de Aplicações Web",
        "Implementando Design Responsivo no CSS",
        "Introdução ao Desenvolvimento Full Stack",
        "Conceitos de Machine Learning na Prática",
        "Criando Aplicações para Realidade Aumentada"
    ];

    const tiposConteudos = Object.values(tiposConteudosEnum);

    const conteudoUrlYoutube = [
        "https://www.youtube.com/watch?v=OBeSEl-pBYY",
        "https://www.youtube.com/watch?v=2HCp9qgXiTY",
        "https://www.youtube.com/watch?v=gCVZYNvA67c",
        "https://www.youtube.com/watch?v=avCKPWHu5vo",
        "https://www.youtube.com/watch?v=nWkJKfPbCfQ",
        "https://www.youtube.com/watch?v=iLw1-w4SpuI",
        "https://www.youtube.com/watch?v=DiGqjYkRQ6o",
        "https://www.youtube.com/watch?v=b7fKfZAzxTY",
        "https://www.youtube.com/watch?v=JX4aOpnAS4I",
        "https://www.youtube.com/watch?v=qVu0teQWvNI",
        "https://www.youtube.com/watch?v=eHgtJh7cp1Y",
        "https://www.youtube.com/watch?v=4PC4S9rJlk0"
    ]

    const topicos = await prisma.topico.findMany({
        select: {
            id: true
        }
    });

    for (let indexTopicos = 0; indexTopicos < topicos.length; indexTopicos++) {
        const conteudos = [];
        for (let indexConteudos = 0; indexConteudos < qtdConteudoTopicos; indexConteudos++) {
            const tipo = faker.random.arrayElement(tiposConteudos)

            let conteudo
            if(tipo === tiposConteudosEnum.UrlYoutube){
                conteudo = faker.random.arrayElement(conteudoUrlYoutube)
            }

            conteudos.push({
                titulo: faker.random.arrayElement(conteudosTitulo),
                topicoId: topicos[indexTopicos]?.id,
                tipo,
                conteudo,
                cargaHoraria: "00:15:00",
                ordem: indexConteudos + 1
            });
        }

        await prisma.conteudoCurso.createMany({
            data: conteudos
        });
    }
    console.log(`${(topicos.length * qtdConteudoTopicos)} conteúdos criados.`);

}
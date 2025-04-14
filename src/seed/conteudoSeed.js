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
        "https://youtu.be/Ptbk2af68e8?si=u5wOyHTa4VGOmQP7",
        "https://youtu.be/1-w1RfGIov4?si=XyBMcRPgHEiLefNG",
        "https://youtu.be/BXqUH86F-kA?si=g6od2kt_gqBD_9UM",
        "https://youtu.be/uzEhd3Lugik?si=rgF-6GutghPiI82c",
        "https://youtu.be/rUTKomc2gG8?si=dR6Kwx-ee2NsUwO4",
        "https://youtu.be/FdePtO5JSd0?si=C96wxWcx4Pam88sg",
        "https://youtu.be/OmmJBfcMJA8?si=MKv9tYBEXTRkTMM3",
        "https://youtu.be/Vbabsye7mWo?si=BX3EJPlDVXpdKyDh",
        "https://youtu.be/mc3TKp2XzhI?si=F01ofPrp7JZc5xaA",
        "https://youtu.be/i6Oi-YtXnAU?si=ZV6uY0FRyQSkeo1_"
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
            if (tipo === tiposConteudosEnum.UrlYoutube) {
                conteudo = faker.random.arrayElement(conteudoUrlYoutube)
            }

            conteudos.push({
                titulo: faker.random.arrayElement(conteudosTitulo),
                topicoId: topicos[indexTopicos]?.id,
                tipo,
                conteudo,
                cargaHoraria: 900,
                ordem: indexConteudos + 1
            });
        }

        await prisma.conteudoCurso.createMany({
            data: conteudos
        });
    }
    console.log(`${(topicos.length * qtdConteudoTopicos)} conteúdos criados.`);

}
import { prisma } from "../config/prismaClient.js";
import faker from 'faker-br';

export default async function topicoSeed(qtdTopicoCurso) {

    const topicosCursos = [
        "Introdução à Programação",
        "Desenvolvimento Web com HTML, CSS e JavaScript",
        "JavaScript Avançado",
        "Desenvolvimento Backend com Node.js",
        "Desenvolvimento Frontend com React",
        "APIs RESTful e GraphQL",
        "Banco de Dados Relacional com MySQL e PostgreSQL",
        "Banco de Dados NoSQL com MongoDB",
        "Introdução à Ciência de Dados",
        "Python para Data Science",
        "Machine Learning com Python",
        "Inteligência Artificial: Fundamentos e Aplicações",
        "DevOps: Conceitos e Ferramentas",
        "Docker e Kubernetes: Orquestração de Containers",
        "Segurança da Informação e Ethical Hacking",
        "Desenvolvimento Mobile com Flutter",
        "Desenvolvimento Mobile com React Native",
        "Introdução ao Desenvolvimento de Jogos",
        "Realidade Aumentada e Virtual",
        "Blockchain e Criptomoedas",
        "Computação em Nuvem com AWS, Azure e Google Cloud",
        "Automação de Testes com Selenium",
        "Testes de Software e Qualidade",
        "Internet das Coisas (IoT)",
        "Redes de Computadores e Protocolos",
        "Introdução à Cibersegurança",
        "Criação de Chatbots com IA",
        "Introdução ao Git e Controle de Versão",
        "Algoritmos e Estruturas de Dados",
        "Fundamentos de Programação com Java",
        "Programação Funcional com Kotlin",
        "Desenvolvimento com C# e .NET",
        "Game Development com Unity",
        "Design UX/UI para Web e Mobile",
        "Inteligência Artificial Generativa",
        "Aprendizado de Máquina com TensorFlow e PyTorch",
        "Elaboração de Projetos com Metodologias Ágeis",
        "Big Data e Análise de Dados",
        "Redes Neurais e Deep Learning",
        "Introdução à Programação Orientada a Objetos",
        "Desenvolvimento Web Full Stack",
        "Construindo Aplicações com Vue.js",
        "Introdução ao TypeScript",
        "Arquitetura de Software: Microservices",
        "Programação Funcional com JavaScript",
        "Gerenciamento de Projetos com Scrum",
        "Inteligência Artificial Conversacional",
        "Testes Unitários e TDD com Jest",
        "Processamento de Linguagem Natural (NLP)",
        "Streaming de Dados com Apache Kafka",
        "Desenvolvimento de Plugins para WordPress",
        "Sistemas Operacionais: Conceitos e Práticas",
        "Criação de Extensões para Navegadores",
        "Implementação de Single Sign-On (SSO)",
        "Engenharia de Dados com Spark e Hadoop",
        "Web Scraping com Python",
        "Análise de Sentimentos com Machine Learning",
        "Introdução ao Desenvolvimento de Software Embarcado",
        "Desenvolvimento de Aplicações para Smart TVs"
    ];


    const cursos = await prisma.curso.findMany({
        select: {
            id: true
        }
    });


    for (let indexCurso = 0; indexCurso < cursos.length; indexCurso++) {
        const topicos = [];
        for (let indexTopicos = 0; indexTopicos < qtdTopicoCurso; indexTopicos++) {
            topicos.push({
                titulo: faker.random.arrayElement(topicosCursos),
                ordem: indexTopicos + 1,
                cursoId: cursos[indexCurso]?.id,
            });
        }

        await prisma.topico.createMany({ 
            data: topicos 
        });
    }
    console.log(`${(cursos.length * qtdTopicoCurso)} topicos criados.`);




}
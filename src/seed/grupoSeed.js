import { prisma } from "../config/prismaClient.js";

export default async function gruposSeed() {
    const regras = [
        { nome: 'USUARIO_CRIAR' },
        { nome: 'USUARIO_DELETAR' },
        { nome: 'USUARIO_ALTERAR' },
        { nome: 'USUARIO_LISTAR' },
    ];

    const nomeDasRegras = []
    for (const regra of regras) {
        await prisma.regra.create({
            data: regra,
        })

        console.log(`Regra criada: ${regra.nome}`)

        nomeDasRegras.push(regra.nome)
    }

    const regraIds = await prisma.regra.findMany({
        where: {
            nome: { in: nomeDasRegras },
        },
        select: { id: true, nome: true },
    });

    // Mapeia os nomes das regras aos seus IDs
    const regraMap = {};
    regraIds.forEach(regra => {
        regraMap[regra.nome] = regra.id;
    });

    
    // Criação do Grupo com associações de regras
    const grupos = [
        {
            nome: 'Administradores',
            regrasOnGrupos: {
                create: [
                    { regrasId: regraMap['USUARIO_CRIAR'] },
                    { regrasId: regraMap['USUARIO_DELETAR'] },
                    { regrasId: regraMap['USUARIO_LISTAR'] },
                    { regrasId: regraMap['USUARIO_ALTERAR'] },
                ],
            },
        },
        {
            nome: 'Ministrantes',
            regrasOnGrupos: {
                create: [
                    { regrasId: regraMap['USUARIO_CRIAR'] },
                    { regrasId: regraMap['USUARIO_DELETAR'] },
                    { regrasId: regraMap['USUARIO_LISTAR'] },
                    { regrasId: regraMap['USUARIO_ALTERAR'] },
                ],
            },
        },
        {
            nome: 'Cursantes',
            regrasOnGrupos: {
                create: [
                    { regrasId: regraMap['USUARIO_CRIAR'] },
                    { regrasId: regraMap['USUARIO_DELETAR'] },
                    { regrasId: regraMap['USUARIO_LISTAR'] },
                    { regrasId: regraMap['USUARIO_ALTERAR'] },
                ],
            },
        }
    ]

    for(let grupo of grupos){

        const grupoCreate = await prisma.grupo.create({
            data: grupo,
        });
    
        console.log('Grupo criado: ', grupoCreate.nome);
    }
}
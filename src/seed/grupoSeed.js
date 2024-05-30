import { prisma } from "../config/prismaClient.js";

export default async function gruposSeed() {

    
    const grupos = [
        {
            nome: 'Administradores'
        },
        {
            nome: 'Ministrantes'
        },
        {
            nome: 'Cursantes'
        }
    ]

    for(let grupo of grupos){

        const grupoCreate = await prisma.grupo.create({
            data: grupo,
        });
    
        console.log('Grupo criado: ', grupoCreate.nome);
    }
}
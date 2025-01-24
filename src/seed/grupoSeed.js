import { prisma } from "../config/prismaClient.js";
import { gruposEnum } from "../utils/enums.js";

export default async function gruposSeed() {

    const grupos = [
        {
            nome: gruposEnum.ADM
        },
        {
            nome: gruposEnum.Alunos
        },
        {
            nome: gruposEnum.Professores
        }
    ]

    for(let grupo of grupos){

        const grupoCreate = await prisma.grupo.create({
            data: grupo,
        });
    
        console.log('Grupo criado: ', grupoCreate.nome);
    }
}

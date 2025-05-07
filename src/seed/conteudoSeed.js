import { prisma } from "../config/prismaClient.js";
import { tiposConteudosEnum } from "../utils/enums.js";
import dataSeed from "./data.js";

export default async function conteudoSeed() {

    let count = 0;

    for (let indexCurso = 0; indexCurso < dataSeed.length; indexCurso++) {

        const curso = dataSeed[indexCurso]
        for (let indexTopicos = 0; indexTopicos < curso.topicos.length; indexTopicos++) {
            const topico = curso.topicos[indexTopicos];

            for (let indexConteudos = 0; indexConteudos < topico.conteudos.length; indexConteudos++) {
                await prisma.conteudoCurso.create({
                    data: {
                        id: topico.conteudos[indexConteudos].id,
                        titulo: topico.conteudos[indexConteudos].titulo,
                        topicoId: topico.id,
                        tipo: tiposConteudosEnum.UrlYoutube,
                        conteudo: topico.conteudos[indexConteudos].link,
                        cargaHoraria: topico.conteudos[indexConteudos].tempo,
                        ordem: topico.conteudos[indexConteudos].ordem
                    }
                })

                count++;
            }
        }

    }

    console.log(`${(count)} conteúdos criados.`);

}
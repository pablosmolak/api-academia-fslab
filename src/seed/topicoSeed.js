import { prisma } from "../config/prismaClient.js";
import dataSeed from "./data.js";

export default async function topicoSeed() {

    let count = 0

    for (let indexCurso = 0; indexCurso < dataSeed.length; indexCurso++) {

        const curso = dataSeed[indexCurso]
        for (let indexTopicos = 0; indexTopicos < curso.topicos.length; indexTopicos++) {
            await prisma.topico.create({
                data: {
                    id: curso.topicos[indexTopicos].id,
                    titulo: curso.topicos[indexTopicos].titulo,
                    ordem: curso.topicos[indexTopicos].ordem,
                    cursoId: curso.id
                }
            });

            count++;
        }

    }

    console.log(`${count} topicos criados.`);
}
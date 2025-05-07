import { prisma } from "../config/prismaClient.js";
import dataSeed from "./data.js";

export default async function instrutorSeed() {

    for (let index = 0; index < dataSeed.length; index++) {

        await prisma.instrutores.create({
            data:{
                cursoId: dataSeed[index].id,
                userId: dataSeed[index].canal_infos.id
            }
        })
    }

    console.log(`Foram criados ${dataSeed.length} instrutores!`);
}
import faker from 'faker-br';
import minioConfig from "../config/minioConfig.js";
import { prisma } from "../config/prismaClient.js";
import { bucketsMinio, gruposEnum } from "../utils/enums.js";
import dataSeed from "./data.js";

export default async function cursoSeed() {

    const categorias = await prisma.categoria.findMany();

    for (let index = 0; index < dataSeed.length; index++) {
        await prisma.curso.create({
            data: {
                id: dataSeed[index].id,
                nome: dataSeed[index].nome_da_playlist,
                descricao: dataSeed[index].descricao_da_playlist,
                capa: `${dataSeed[index].id}.jpg`,
                cargaHoraria: dataSeed[index].carga_horaria_total,
                publicado: true,
                criador: dataSeed[index].canal_infos.id ,
                categoria: {
                    connect: await categorias.filter(categoria => {
                        return dataSeed[index].categoria.includes(categoria.nome)
                    }).map(categoria => {
                        return { id: categoria.id }
                    })
                }
            }
        })
    }

    console.log(`${dataSeed.length} cursos Criados`);
}

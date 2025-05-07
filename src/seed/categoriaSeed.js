import { prisma } from "../config/prismaClient.js";
import dataSeed from "./data.js";

export default async function categoriaSeed() {

    const tags = new Set()

    dataSeed
        .flatMap(data => data.categoria)
        .forEach(tag => tags.add(tag))

    const data = Array.from(tags).map(tag => ({
        nome: tag
    }))

    const categoriasCriadas = await prisma.categoria.createMany({
        data
    });

    console.log(categoriasCriadas.count + " categorias criadas!");
}
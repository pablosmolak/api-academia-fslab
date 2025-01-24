import { prisma } from "../config/prismaClient.js";

export const pagination = async (table, pagina = 1, limite = 10, filtros) => {

    pagina = Math.max(pagina, 1)
    limite = Math.max(Math.min(limite, 100), 1) // limite maximo

    const totalRegistros = await prisma[table].count(filtros);
    const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
    const paginaAtual = Math.min(pagina, totalPaginas);

    const pagination = {
        skip: limite * (paginaAtual - 1),
        take: limite,
        totalPaginas,
        paginaAtual
    }

    return pagination
}
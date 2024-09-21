import { prisma } from "../config/prismaClient.js";

export const pagination = async (table, pagina = 1, limite = 10, filtros) => {

    pagina = Math.max(pagina, 1)
    limite = Math.min(limite, 100) // limite maximo

    const totalRegistros = await prisma[table].count(filtros);
    const totalPaginas = Math.ceil(totalRegistros / limite);
    const paginaAtual = Math.min(pagina, totalPaginas);

    const pagination = {
        skip: limite * (paginaAtual - 1),
        take: limite,
        totalPaginas,
        paginaAtual
    }

    return pagination
}
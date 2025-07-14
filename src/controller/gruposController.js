import { prisma } from "../config/prismaClient.js";
import { sendResponse } from "../utils/mensagens.js";

export default class GruposController {
    static async buscarGrupos(req, res) {
        const grupos = await prisma.grupo.findMany();

        return sendResponse(res, 200, grupos)
    }
}
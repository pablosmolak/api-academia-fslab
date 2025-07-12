import { z } from "zod"
import { myZ } from "../utils/zod.js"

export class inscricaoSchema {
    static criarInscricao = z.object({
        cursoId: z.string().uuid()
    })

    static listarInscricaoPorCurso = z.object({
        cursoId: z.string().uuid()
    })

    static filtrosListarInscricoes = z.object({
        cursoId: z.string().uuid().optional(),
        usuarioId: z.string().uuid().optional(),
        pagina: z.string().optional(),
        limite: z.string().optional()
    })
}
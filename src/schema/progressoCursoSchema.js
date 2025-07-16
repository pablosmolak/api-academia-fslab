import { z } from "zod"

export class progressoSchema {
    static finalizarAtividade = z.object({
        conteudoid: z.string().uuid()
    })

    static listarProgresso = z.object({
        cursoId: z.string().uuid()
    })

    static filtrosListarProgresso = z.object({
        cursoId: z.string().uuid().optional(),
        usuarioId: z.string().uuid().optional(),
        pagina: z.string().optional(),
        limite: z.string().optional()
    })
} 
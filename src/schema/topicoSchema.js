import { z } from "zod"

export class topicoSchema {
    static criarTopico = z.object({
        titulo: z.string().min(3).max(200),
        cursoId: z.string().uuid()
    })

    static alterarTopico = z.object({
        titulo: z.string().min(3).max(200).optional(),
        ordem: z.number().optional()
    })
} 
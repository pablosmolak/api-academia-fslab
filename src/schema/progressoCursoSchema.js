import { z } from "zod"

export class progressoSchema {
    static finalizarAtividade = z.object({
        conteudoid: z.string().uuid()
    })
} 
import { z } from "zod"

export class certificadoSchema {
    static buscarCertificado = z.object({
        cursoId: z.string().uuid()
    })
    
    static buscarCertificadoPorUsuario = z.object({
        userId: z.string().uuid()
    })
}
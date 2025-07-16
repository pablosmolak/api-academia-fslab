import { z } from "zod"

export class certificadoSchema {
    static buscarCertificado = z.object({
        cursoId: z.string().uuid()
    })

    static buscarCertificadoPorUsuario = z.object({
        userId: z.string().uuid()
    })

    static filtrosListarCertificado = z.object({
        cursoId: z.string().uuid().optional(),
        usuarioId: z.string().uuid().optional(),
        pagina: z.string().optional(),
        limite: z.string().optional()
    })
}
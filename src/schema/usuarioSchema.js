import { z } from "zod"
import { myZ } from "../utils/zod.js"

export class usuarioSchema {
    static criarUsuario = z.object({
        nome: z.string().min(3).max(200),
        email: myZ.email(),
        senha: myZ.senha()
    })
    static alterarUsuario = z.object({
        id: z.string().uuid(),
        nome: z.string().min(3).max(200).optional(),
        email: myZ.email().optional(),
        senha: myZ.senha().optional()
    })
    static listarUsuario = z.object({
        id: z.string().uuid()
    })
}  
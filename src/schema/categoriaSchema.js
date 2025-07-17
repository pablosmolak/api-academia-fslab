import {z} from "zod"

export class categoriaSchema{
    static criarCategoria = z.object({
        nome: z.string().min(3).max(200),
    })
    static alterarCategoria = z.object({
        id: z.string().uuid(),
        nome: z.string().min(3).max(200).optional()
    })
}
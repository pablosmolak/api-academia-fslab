import {z} from "zod"
import { myZ } from "../utils/zod.js"

export class cursoSchema{
    static criarCurso = z.object({
        nome: z.string().min(3).max(200),
        descricao: z.string().min(200).max(5000),
        categoria : z.array(z.string().uuid()).optional()
    })

    static listarCurso = z.object({
        id: z.string().uuid()
    })
}
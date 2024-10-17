import {z} from "zod"
import { myZ } from "../utils/zod.js"

export class usuarioSchema{
    static criarUsuario = z.object({
        nome: z.string().min(4)
    })
}
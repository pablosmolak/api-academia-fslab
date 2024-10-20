import {z} from "zod"
import { myZ } from "../utils/zod.js"

export class usuarioSchema{
    static criarUsuario = z.object({
        nome: z.string().min(3).max(200),
        email: myZ.email(),
        senha : myZ.senha()
    })
}
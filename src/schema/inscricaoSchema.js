import {z} from "zod"
import { myZ } from "../utils/zod.js"

export class inscricaoSchema{
    static criarInscricao = z.object({
        cursoId : zz.string().uuid()
    })
}
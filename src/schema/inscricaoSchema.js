import {z} from "zod"
import { myZ } from "../utils/zod.js"

export class inscricaoSchema{
    static criarInscricao = z.object({
        cursoId : z.string().uuid()
    })

    static listarInscricaoPorCurso = z.object({
        cursoId : z.string().uuid()
    })
}
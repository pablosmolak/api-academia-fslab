import {z} from "zod"
import { myZ } from "../utils/zod.js"
import { tiposConteudosEnum } from "../utils/enums.js"

export class conteudoCursoSchema{
    static criarConteudo = z.object({
        topicoId : z.string().uuid(),
        titulo: z.string().min(3).max(50),
        tipo: z.enum(Object.values(tiposConteudosEnum)),
        conteudo: z.string(),
        cargaHoraria: myZ.cargaHoraria()
    })
}
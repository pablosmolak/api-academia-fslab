import {object, z} from "zod"
import { myZ } from "../utils/zod.js"
import { tiposConteudosEnum } from "../utils/enums.js"

export class conteudoCursoSchema{
    static criarConteudo = z.object({
        topicoId : z.string().uuid(),
        tipo: z.enum(Object.values(tiposConteudosEnum)),
        conteudo: z.string(),
        cargaHoraria: myZ.cargaHoraria()
    
    })
}
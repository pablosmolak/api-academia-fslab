import {z} from "zod"
import { myZ } from "../utils/zod.js"

export class recuperaSenhaSchema{
    static recupera = z.object({
        email : myZ.email(),
        urlFront: z.string()
    })

    static alteraSenhaBody = z.object({
        senha: myZ.senha()
    })
    
    static alteraSenhaQuery = z.object({
        token: z.string(),
        email: myZ.email()
    })
}
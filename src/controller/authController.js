import jwt from "jsonwebtoken"
import { sendResponse } from "../utils/mensagens.js"

export default class AuthController {
    static async logar(req, res) {

        const { usuario } = req
       
        const token = {
            token: jwt.sign(
                {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    ativo: usuario.ativo
                },
                process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRATION}
            )
        }

        res.status(200).json(token)
    }
}
import jwt from "jsonwebtoken"
import { sendError, messages, sendResponse } from "../utils/mensagens.js"
import { prisma } from "../config/prismaClient.js";
import crypto from "crypto";
import enviaemail from "../utils/enviaEmail.js";
import bcrypt from "bcryptjs";

export default class RecuperaSenhaController {
    static async recuperaSenha(req, res) {
        const { email } = req.body

        console.log(email)

        

        const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_RECUPERA_SENHA,
        })

        if (!token) sendError(res, 500, ["Erro ao gerar o token de recuperação de senha!"])

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                tokenRecuperaSenha: token
            }
        })

        let info = ({
            from: "\"Levantamento Patrimonial: Alteração de Senha \"" + ' <' + (process.env.API_SEND_EMAIL) + '>',
            to: usuario.email,
            subject: "Solicitação de recuperação de senha - Solicitação #" + crypto.randomBytes(6).toString("hex"),
            html: "Olá " + usuario.nome + ", você solicitou a recuperação de senha! <br> <a href='" + (url + "/alterarsenha?token=" + token + "&email=" + usuario.email) + "'>Clique aqui para alterar sua senha!</a>",
        })

        await enviaemail(info)

        return sendResponse(res, 200, ["Solicitação de alteração de senha enviada com sucesso!"])
    }

    static async alteraSenha(req, res) {
        const { email } = req.query;
        const { senha } = req.body;

        await prisma.usuario.update({
            where: { email: email },
            data: {
                senha: bcrypt.hashSync(senha, 10),
                tokenRecuperaSenha: null
            }
        })

        return sendResponse(res, 200, ["Senha atualizada com sucesso!"])
    }
}

import jwt from "jsonwebtoken"
import { sendError, messages, sendResponse } from "../utils/mensagens.js"
import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import { EmailService } from "../services/emailService.js";
import { recuperaSenhaSchema } from "../schema/recuperaSenhaSchema.js";

export default class RecuperaSenhaController {
    static async recuperaSenha(req, res) {
        const { email, urlFront } = recuperaSenhaSchema.recupera.parse(req.body)

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        if (!usuario) return sendResponse(res, 200, ["Solicitação de alteração de senha enviada com sucesso!"])

        if (!usuario.ativo) return sendError(res, 400, ["Usuário inativo!"])

        delete usuario.senha
        delete usuario.tokenRecuperaSenha

        const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_RECUPERA_SENHA,
        })

        if (!token) return sendError(res, 500, ["Erro ao gerar o token de recuperação de senha!"])

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                tokenRecuperaSenha: token
            }
        })

        await EmailService.sendEmail({
            "subject": "Academia FSLab - Solicitação de recuperação de senha",
            "to": email,
            "template": "academia-recuperacaosenha",
            "data": {
                "userName": usuario.nome,
                "resetLink": `${urlFront}?token=${token}&email=${email}`
            }
        });

        return sendResponse(res, 200, ["Solicitação de alteração de senha enviada com sucesso!"])
    }

    static async alteraSenha(req, res) {
        const { token, email } = recuperaSenhaSchema.alteraSenhaQuery.parse(req.query);
        const { senha } = recuperaSenhaSchema.alteraSenhaBody.parse(req.body);

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })

        if (!usuario) return sendError(res, 422, messages.validationGeneric.mascCamp("Usuário"))

        if (!usuario.tokenRecuperaSenha) return sendError(res, 422, "Recuperação de senha não solicitada ou já efetuada!")

        if (!usuario.ativo) return sendError(res, 400, ["Usuário inativo!"])

        if (token !== usuario.tokenRecuperaSenha) return sendError(res, 498, messages.auth.invalidToken)

        jwt.verify(token, process.env.JWT_SECRET, async (err) => {
            if (err) return sendError(res, 498, messages.auth.invalidToken)
        })

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                senha: bcrypt.hashSync(senha, 10),
                tokenRecuperaSenha: null
            }
        })

        return sendResponse(res, 200, ["Senha atualizada com sucesso!"])
    }
}

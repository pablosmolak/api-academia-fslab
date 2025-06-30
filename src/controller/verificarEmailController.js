import { prisma } from "../config/prismaClient.js"
import { verificarEmailSchema } from "../schema/verificarEmailSchema.js"
import { EmailService } from "../services/emailService.js"
import { sendError, sendResponse } from "../utils/mensagens.js"

export default class VerificarEmailController {
    static async verificarEmail(req, res) {
        let { codigoVerificacaoEmail } = verificarEmailSchema.verificarEmail.parse(req.body)

        const user = await prisma.usuario.findUnique({
            where: {
                id: req.user.id
            }
        })

        if (user.emailVerificado) {
            return sendError(res, 422, { path: "codigoVerificacaoEmail", message: "Email já verificado!" })
        }

        if (user.codigoVerificacaoEmail != codigoVerificacaoEmail) {
            return sendError(res, 422, { path: "codigoVerificacaoEmail", message: "Código de verificação inválido!" })
        }

        if (user.expirationVerificacaoEmail < new Date()) {
            return sendError(res, 422, { path: "codigoVerificacaoEmail", message: "Código de verificação expirado!" })
        }

        await prisma.usuario.update({
            where: { id: req.user.id },
            data: {
                emailVerificado: true,
                codigoVerificacaoEmail: null,
                expirationVerificacaoEmail: null
            }
        });

        return sendResponse(res, 200, []);
    }

    static async enviarCodigoVerificarEmail(req, res) {
        const user = await prisma.usuario.findUnique({
            where: {
                id: req.user.id
            }
        })

        if (user.emailVerificado) {
            return sendError(res, 422, ["Email já verificado!"])
        }

        const codigoVerificacao = Math.floor(100000 + Math.random() * 900000);

        const expirationInMs = 30 * 60 * 1000; // 30 minutos em milissegundos

        await prisma.usuario.update({
            where: { id: req.user.id },
            data: {
                codigoVerificacaoEmail: codigoVerificacao,
                expirationVerificacaoEmail: new Date(new Date().getTime() + expirationInMs)
            }
        });

        await EmailService.sendEmail({
            "subject": "Academia FSLab - Confirme o seu E-mail",
            "to": user.email,
            "template": "academia-verificaemail",
            "data": {
                "userName": user.nome,
                "verificationCode": `${codigoVerificacao}`
            }
        });

        return sendResponse(res, 200, []);
    }
}
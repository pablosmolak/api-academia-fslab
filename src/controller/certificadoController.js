import { prisma } from "../config/prismaClient.js";
import messages, { sendResponse } from "../utils/mensagens.js";

export default class CertificadoController {

    static async listarCertificados(req, res) {

        const certificados = await prisma.certificado.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        });

        return sendResponse(res, 200, certificados);
    }

    static async listarCertificadosDoUsuario(req, res) {
        const { id } = req.params

        const certificado = await prisma.certificado.findMany({
            where: {
                userId: id
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        })

        return sendResponse(res, 200, certificado)
    }


    static async validarCertificado(req, res) {
        const { validador } = req.params

        const certificado = await prisma.certificado.findUnique({
            where: {
                validador: validador
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true
                    }
                }
            }
        })

        return sendResponse(res, 200, certificado);
    }
}

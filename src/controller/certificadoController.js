import { prisma } from "../config/prismaClient.js";
import { certificadoSchema } from "../schema/certificadoSchema.js";
import { gruposEnum } from "../utils/enums.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { pagination } from "../utils/pagination.js";

export default class CertificadoController {

    static async listarCertificados(req, res) {
        const filtros = { where: {} }

        const { cursoId, usuarioId, pagina = 1, limite = 10 } = certificadoSchema.filtrosListarCertificado.parse(req.query)

        if (cursoId) filtros.where.cursoId = { contains: cursoId }
        if (usuarioId) filtros.where.userId = { contains: usuarioId }

        if (req.user.grupo === gruposEnum.Professores) {
            const usuarioId = req.user.id;

            const filtroInstrutorCriador = {
                OR: [
                    {
                        curso: {
                            criador: usuarioId
                        }
                    },
                    {
                        curso: {
                            instrutores: {
                                some: {
                                    usuario: {
                                        id: usuarioId
                                    }
                                }
                            }
                        }
                    }
                ]
            };

            filtros.where = {
                AND: [
                    filtros.where,
                    filtroInstrutorCriador,
                ],
            };
        }

        const paginacao = await pagination('certificado', pagina, limite, filtros)

        const certificados = await prisma.certificado.findMany({
            ...filtros,
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
                        descricao: true,
                        cargaHoraria: true
                    }
                }
            },
            skip: paginacao.skip,
            take: paginacao.take
        });

        for (let certificado of certificados) {
            const horas = String(Math.floor(certificado.curso.cargaHoraria / 3600)).padStart(2, "0");
            const minutos = String(Math.floor((certificado.curso.cargaHoraria % 3600) / 60)).padStart(2, "0");
            const segundosRestantes = String(certificado.curso.cargaHoraria % 60).padStart(2, "0");

            certificado.curso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`
        }

        return sendResponse(res, 200, certificados,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take }
        );
    }

    static async listarCertificadosDoUsuarioLogado(req, res) {
        const userId = req.user.id;

        const certificados = await prisma.certificado.findMany({
            where: {
                userId
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
                        descricao: true,
                        cargaHoraria: true
                    }
                }
            }
        })

        for (let certificado of certificados) {
            const horas = String(Math.floor(certificado.curso.cargaHoraria / 3600)).padStart(2, "0");
            const minutos = String(Math.floor((certificado.curso.cargaHoraria % 3600) / 60)).padStart(2, "0");
            const segundosRestantes = String(certificado.curso.cargaHoraria % 60).padStart(2, "0");

            certificado.curso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`
        }

        return sendResponse(res, 200, certificados)
    }

    static async listarCertificadosDoCursoDoUsuarioLogado(req, res) {
        const userId = req.user.id

        const { cursoId } = certificadoSchema.buscarCertificado.parse(req.params)

        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoId,
            }
        })

        if (!findCurso) {
            return sendError(res, 422, { path: "cursoId", message: messages.validationGeneric.notFound("id do curso") });
        }

        const certificado = await prisma.certificado.findFirst({
            where: {
                cursoId,
                userId
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
                        descricao: true,
                        cargaHoraria: true
                    }
                }
            }
        })

        if (!certificado) {
            return sendError(res, 404, 'Nenhum certificado encontrado para esse curso!');
        }

        const horas = String(Math.floor(certificado.curso.cargaHoraria / 3600)).padStart(2, "0");
        const minutos = String(Math.floor((certificado.curso.cargaHoraria % 3600) / 60)).padStart(2, "0");
        const segundosRestantes = String(certificado.curso.cargaHoraria % 60).padStart(2, "0");

        certificado.curso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`

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
                        descricao: true,
                        cargaHoraria: true
                    }
                }
            }
        })

        if (!certificado) {
            return sendError(res, 404, [{
                path: "id",
                message: "Nenhum certificado encontrado com esse validador"
            }])
        }

        const horas = String(Math.floor(certificado.curso.cargaHoraria / 3600)).padStart(2, "0");
        const minutos = String(Math.floor((certificado.curso.cargaHoraria % 3600) / 60)).padStart(2, "0");
        const segundosRestantes = String(certificado.curso.cargaHoraria % 60).padStart(2, "0");

        certificado.curso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`

        return sendResponse(res, 200, certificado);
    }
}
import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { pagination } from "../utils/pagination.js";

export default class CursosController {
    static async criarCurso(req, res) {
        const erros = []

        let { nome, descricao, categoria } = req.body

        if (!nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        } else {
            if (nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (descricao) {
            if (descricao.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (descricao.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (!categoria) {
            erros.push(messages.validationGeneric.fieldIsRequired("Categoria"))
        } else {
            const findCategoria = await prisma.categoria.findMany({
                where: {
                    id: {
                        in: categoria
                    }
                },
                select: { id: true }
            })

            const categoriasEncontradas = findCategoria.map(item => item.id);

            // Filtra os IDs não encontrados
            const categoriasNaoEncontradas = categoria.filter(id => !categoriasEncontradas.includes(id));

            if (categoriasNaoEncontradas.length > 0) {
                erros.push(`Nenhuma categoria encontrada com os IDS: ${categoriasNaoEncontradas.join(', ')}`);
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        let cursoCriado
        await prisma.$transaction(async (prisma) => {
            cursoCriado = await prisma.curso.create({
                data: {
                    nome,
                    descricao,
                    categoria: {
                        connect: categoria.map((id) => {
                            return { id }
                        }
                        )
                    }
                },
            })

            await prisma.instrutores.create({
                data: {
                    cursoId: cursoCriado.id,
                    userId: req.user.id,
                    criadorDoCurso: true
                }
            })
        })

        return sendResponse(res, 201, cursoCriado);
    }

    static async listarCursos(req, res) {

        const { pagina = 1, limite = 10 } = req.query

        const paginacao = await pagination("curso", pagina, limite)

        const cursos = await prisma.curso.findMany({
            include: {
                categoria: true
            },
            skip: paginacao.skip,
            take: paginacao.take
        })

        return sendResponse(res, 200, cursos,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take }
        )
    }

    static async listarCursoPorId(req, res) {
        const { id } = req.params

        const findCurso = await prisma.curso.findUnique({
            where: {
                id,
            },
            include: {
                topicos: {
                    include: {
                        conteudos: {
                            orderBy: { ordem: 'asc' }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                },
                categoria: true
            },
        })

        if (findCurso === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("ID")])
        }

        return sendResponse(res, 200, findCurso);
    }

    static async listarInformacoesCurso(req, res) {
        const { cursoid } = req.params

        const curso = await prisma.curso.findUnique({
            where: {
                id: cursoid
            },
            include: {
                categoria: {
                    select: {
                        nome: true
                    }
                },
                topicos: {
                    include: {
                        conteudos: true
                    }
                },
                instrutores: {
                    include: {
                        usuario:{
                            select:{
                                nome:true,
                                fotoPerfil:true,
                                id:true
                            }
                        }
                    }
                }
            }
        })

        if (curso === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("id")])
        }


        //console.log(JSON.stringify(curso, null, 2));

        let informacoesCurso = {}

        informacoesCurso.nomeCurso = curso.nome
        informacoesCurso.descricao = curso.descricao
        informacoesCurso.topicos =  curso.topicos.map(topico => topico.titulo)
        informacoesCurso.instrutores = curso.instrutores.map(instrutor => instrutor.usuario)
        informacoesCurso.cargaHoraria = () => {
            const cargaHoraria = 0

            for(let topico in curso.topicos){
                console.log(topico)
            }

            return cargaHoraria
        }

        return sendResponse(res, 200, informacoesCurso)
    }

    static async deletarCurso(req, res) {
        const { id } = req.params

        const cursoExist = await prisma.curso.findUnique({
            where: {
                id
            }
        })

        if (cursoExist === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("id")])
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.instrutores.deleteMany({
                where: {
                    cursoId: id
                }
            })

            await prisma.conteudoCurso.deleteMany({
                where: {
                    aula: {
                        cursoId: id,
                    },
                },
            })

            await prisma.topico.deleteMany({
                where: {
                    cursoId: id,
                },
            })

            await prisma.curso.delete({
                where: {
                    id
                }
            })
        })
        return sendResponse(res, 200, [])
    }

    static async listarCursosInscritosPorUsuario(req, res) {
        const { usuarioid } = req.params

        const cursosInscritos = await prisma.usuario.findUnique({
            where: { id: usuarioid },
            select: {
                inscricoes: {
                    select: {
                        curso: {
                            select: {
                                id: true,
                                nome: true,
                                descricao: true,

                            },
                        },
                        status: true,
                        dataInscricao: true,
                    },
                },
                progressoCursos: true
            },
        });

        if (cursosInscritos === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("id")])
        }

        return sendResponse(res, 200, cursosInscritos);
    }
}
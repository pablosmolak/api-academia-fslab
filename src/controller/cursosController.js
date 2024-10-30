import { prisma } from "../config/prismaClient.js";
import { tiposConteudosEnum } from "../utils/enums.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { pagination } from "../utils/pagination.js";
import { cursoSchema } from "../schema/cursoSchema.js";


export default class CursosController {
    static async criarCurso(req, res) {
        const erros = []

        let { nome, descricao, categoria = [] } = cursoSchema.criarCurso.parse(req.body)

        if (categoria && categoria.length > 0) {
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
                        usuario: {
                            select: {
                                nome: true,
                                fotoPerfil: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })

        if (curso === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("id")])
        }

        let cargaHoraria = () => {
            let Totalminutos = 0

            for (const topico of curso.topicos) {
                for (const conteudo of topico.conteudos) {
                    if (conteudo.cargaHoraria) {
                        let [horas, minutos, segundos] = conteudo.cargaHoraria.split(":").map(Number)
                        Totalminutos += ((horas * 60) + minutos + (segundos / 60));
                    }
                }
            }

            const horasTotais = Math.floor(Totalminutos / 60);
            const minutosRestantes = Math.round(Totalminutos % 60);

            return `${horasTotais}h${minutosRestantes}m`;
        }

        let quantidadeConteudo = (tipo) => {
            let qtdConteudo = 0

            for (const topico of curso.topicos) {
                for (const conteudo of topico.conteudos) {
                    if (conteudo.tipo === tipo) {
                        qtdConteudo++
                    }
                }
            }

            return qtdConteudo
        }

        let informacoesCurso = {
            nomeCurso: curso.nome,
            descricao: curso.descricao,
            topicos: curso.topicos.map(topico => topico.titulo),
            instrutores: curso.instrutores.map(instrutor => instrutor.usuario),
            cargaHoraria: cargaHoraria(),
            quantidadeDeVideo: quantidadeConteudo(tiposConteudosEnum.UrlYoutube),
            quantidadeAtividade: (quantidadeConteudo(tiposConteudosEnum.UrlYoutube - quantidadeConteudo(true)))
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
                    topico: {
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

    static async listarInstrutoresDoCurso(req, res) {
        const cursoID = req.params.id

        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoID,
            },
            include: {
                instrutores: {
                    include: {
                        usuario: {
                            select: {
                                nome: true,
                                email: true,
                                fotoPerfil: true,
                                id: true
                            }
                        }
                    }
                }
            },
        })

        if (findCurso === null) {
            return sendError(res, 404, [messages.validationGeneric.notFound("ID")])
        }

        const instrutores = findCurso.instrutores.map(instrutor => instrutor.usuario)

        return sendResponse(res, 200, instrutores);
    }

    static async adicionarInstrutores(req, res) {
        const erros = [];
        const cursoID = req.params.id;
        const { usersID } = req.body;

        // Verifica se o curso existe
        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoID,
            }
        });

        if (!findCurso) {
            erros.push(messages.validationGeneric.notFound("ID do Curso"));
        }

        // Verifica se cada usuário existe
        for (const user of usersID) {
            const findUser = await prisma.usuario.findUnique({
                where: {
                    id: user,
                },
            });

            if (!findUser) {
                erros.push(messages.validationGeneric.notFound(`ID do Usuário: ${user}`));
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros);

        const instrutores = []
        await prisma.$transaction(async (prisma) =>{
            
            for(const user of usersID){
                instrutores.push(
                    await prisma.instrutores.create({
                        data:{
                            cursoId: cursoID,
                            userId: user
                        }
                    })
                )
            }
        })

        sendResponse(res,201,instrutores)
    }

}
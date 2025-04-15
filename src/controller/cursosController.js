import fs from 'fs';
import { prisma } from "../config/prismaClient.js";
import { cursoSchema } from "../schema/cursoSchema.js";
import { instrutorSchema } from "../schema/instrutorSchema.js";
import { bucketsMinio, gruposEnum, tiposConteudosEnum } from "../utils/enums.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import minioFunctions from "../utils/minioFunctions.js";
import { pagination } from "../utils/pagination.js";

export default class CursosController {
    static async criarCurso(req, res) {
        const erros = []

        let { nome, descricao, categoria = [] } = cursoSchema.criarCurso.parse(req.body)

        const findCurso = await prisma.curso.findFirst({
            where: {
                nome: nome
            }
        })

        if (findCurso !== null) {
            erros.push({ path: "nome", message: messages.validationGeneric.fieldIsRepeated("Nome") })
        }

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
                erros.push({ path: "categoria", message: `Nenhuma categoria encontrada com os IDS: ${categoriasNaoEncontradas.join(', ')}` });
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const cursoCriado = await prisma.curso.create({
            data: {
                nome,
                descricao,
                categoria: {
                    connect: categoria.map((id) => {
                        return { id }
                    }
                    )
                },
                criador: req.user.id
            },
        })

        return sendResponse(res, 201, cursoCriado);
    }

    static async listarCursosPublicados(req, res) {
        let filtros = { where: { publicado: true } }

        const { filtro, pagina = 1, limite = 10 } = req.query

        if (filtro) filtros.where = {
            OR: [
                { nome: { contains: filtro } },
                // { descricao: { contains: filtro } },
                { categoria: { some: { nome: { contains: filtro } } } },
                { instrutores: { some: { usuario: { nome: { contains: filtro } } } } }
            ]
        }

        const paginacao = await pagination("curso", pagina, limite, filtros)

        const cursos = await prisma.curso.findMany({
            ...filtros,
            include: {
                categoria: true,
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
            },
            skip: paginacao.skip,
            take: paginacao.take
        })

        for (let curso of cursos) {
            curso.instrutores = curso.instrutores.map(instrutor => instrutor.usuario)

            const horas = String(Math.floor(curso.cargaHoraria / 3600)).padStart(2, "0");
            const minutos = String(Math.floor((curso.cargaHoraria % 3600) / 60)).padStart(2, "0");
            const segundosRestantes = String(curso.cargaHoraria % 60).padStart(2, "0");

            curso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`
        }

        return sendResponse(res, 200, cursos,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take }
        )
    }

    static async listarTodosCursos(req, res) {
        let filtros = { where: {} }

        const { filtro, publicado, pagina = 1, limite = 10 } = req.query

        if (filtro) filtros.where = {
            OR: [
                { nome: { contains: filtro } },
                // { descricao: { contains: filtro } },
                { categoria: { some: { nome: { contains: filtro } } } },
                { instrutores: { some: { usuario: { nome: { contains: filtro } } } } }
            ]
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const usuarioId = req.user.id;
            const filtroInstrutorCriador = {
                OR: [
                    { criador: usuarioId },
                    {
                        instrutores: {
                            some: {
                                usuario: {
                                    id: usuarioId
                                }
                            }
                        }
                    }
                ],
            };

            filtros.where = {
                AND: [
                    filtros.where,
                    filtroInstrutorCriador,
                ],
            };
        }

        if (publicado == "true" || publicado == "false") filtros.where.publicado = publicado == "true" ? true : false

        const paginacao = await pagination("curso", pagina, limite, filtros)

        const cursos = await prisma.curso.findMany({
            ...filtros,
            include: {
                categoria: true,
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
            skip: paginacao.skip,
            take: paginacao.take
        })

        for (let curso of cursos) {
            curso.instrutores = curso.instrutores.map(instrutor => instrutor.usuario)

            const horas = String(Math.floor(curso.cargaHoraria / 3600)).padStart(2, "0");
            const minutos = String(Math.floor((curso.cargaHoraria % 3600) / 60)).padStart(2, "0");
            const segundosRestantes = String(curso.cargaHoraria % 60).padStart(2, "0");

            curso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`
        }

        return sendResponse(res, 200, cursos,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take }
        )
    }

    static async alterarStatusCurso(req, res) {
        const erros = []

        let filtros = { where: {} }

        const { id } = req.params
        const usuarioLogado = req.user

        filtros.where.id = id

        if (req.user.grupo === gruposEnum.Professores) {
            const filtroInstrutorCriador = {
                OR: [
                    { criador: usuarioLogado.id },
                    {
                        instrutores: {
                            some: {
                                usuario: {
                                    id: usuarioLogado.id
                                }
                            }
                        }
                    }
                ],
            };

            filtros.where = {
                AND: [
                    filtros.where,
                    filtroInstrutorCriador,
                ]
            };
        }

        const curso = await prisma.curso.findMany({
            ...filtros,
            include: {
                topicos: {
                    include: {
                        conteudos: true
                    }
                }
            }
        })

        if (curso.length === 0) {
            return sendError(res, 403, { path: "id", message: "Sem permissão para alterar o status do curso" })
        }

        if (!curso[0].publicado) {

            if (curso[0].topicos.length === 0) {
                erros.push({ path: "topicos", message: "O curso não pode ser publicado sem tópicos!" })
            }

            const algumTopicoSemConteudo = curso[0].topicos.some(topico =>
                !topico.conteudos || topico.conteudos.length === 0
            );

            if (algumTopicoSemConteudo) {
                erros.push({
                    path: "topicos",
                    message: "O curso não pode ser publicado sem cada tópico do curso ter ao menos um conteúdo!"
                });
            }

            if (erros.length > 0) return sendError(res, 422, erros)
        }
        await prisma.curso.update({
            where: { id },
            data: {
                publicado: !curso[0].publicado
            }
        })

        return sendResponse(res, 200, {
            publicado: !curso[0].publicado
        })
    }

    static async listarCursoPublicadoPorId(req, res) {
        const { id } = req.params

        const findCurso = await prisma.curso.findUnique({
            where: {
                id,
                publicado: true
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
                categoria: true,
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
            return sendError(res, 404, { path: "id", message: "Nenhum curso publicado encontrado com esse ID" })
        }

        findCurso.instrutores = findCurso.instrutores.map(instrutor => instrutor.usuario)

        const formatarDuracao = (segundos) => {
            const horas = String(Math.floor(segundos / 3600)).padStart(2, "0");
            const minutos = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
            const segundosRestantes = String(segundos % 60).padStart(2, "0");
            return `${horas}:${minutos}:${segundosRestantes}`;
        };

        findCurso.cargaHoraria = formatarDuracao(findCurso.cargaHoraria)

        findCurso.topicos.forEach(topico => {
            topico.conteudos.forEach(conteudo => {
                conteudo.cargaHoraria = formatarDuracao(conteudo.cargaHoraria)
            })
        })

        return sendResponse(res, 200, findCurso);
    }

    static async listarTodosCursosPorId(req, res) {
        const { id } = req.params

        let filtros = { where: { id } }

        if (req.user.grupo === gruposEnum.Professores) {
            const usuarioId = req.user.id;
            filtros.where.OR = [
                { criador: usuarioId },
                {
                    instrutores: {
                        some: {
                            usuario: {
                                id: usuarioId
                            }
                        }
                    }
                }
            ]
        }

        const findCurso = await prisma.curso.findUnique({
            ...filtros,
            include: {
                topicos: {
                    include: {
                        conteudos: {
                            orderBy: { ordem: 'asc' }
                        }
                    },
                    orderBy: { ordem: 'asc' }
                },
                categoria: true,
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
            return sendError(res, 404, { path: "id", message: "Nenhum curso encontrado com esse ID" })
        }

        findCurso.instrutores = findCurso.instrutores.map(instrutor => instrutor.usuario)

        const horas = String(Math.floor(findCurso.cargaHoraria / 3600)).padStart(2, "0");
        const minutos = String(Math.floor((findCurso.cargaHoraria % 3600) / 60)).padStart(2, "0");
        const segundosRestantes = String(findCurso.cargaHoraria % 60).padStart(2, "0");

        findCurso.cargaHoraria = `${horas}:${minutos}:${segundosRestantes}`

        return sendResponse(res, 200, findCurso);
    }

    static async listarInformacoesCurso(req, res) {
        const { cursoid } = req.params

        const curso = await prisma.curso.findUnique({
            where: {
                id: cursoid,
                publicado: true
            },
            include: {
                categoria: {
                    select: {
                        nome: true
                    }
                },
                topicos: {
                    include: {
                        conteudos: {
                            orderBy: { ordem: 'asc' }
                        }
                    },
                    orderBy: { ordem: 'asc' }
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
            return sendError(res, 404, { path: "id", message: "Nenhum curso publicado encontrado com esse ID" })
        }

        let cargaHoraria = () => {
            const cargaHoraria = curso.cargaHoraria

            const totalMinutos = Math.floor(cargaHoraria / 60);
            const horasTotais = Math.floor(totalMinutos / 60);
            const minutosRestantes = Math.round(totalMinutos % 60);

            if (minutosRestantes === 0) {
                return `${horasTotais}h`;
            } else if (horasTotais === 0) {
                return `${minutosRestantes}m`;
            }

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

        const quantidadeInscritos = await prisma.inscricao.count({
            where: {
                cursoId: cursoid
            }
        });

        let informacoesCurso = {
            id: curso.id,
            nomeCurso: curso.nome,
            descricao: curso.descricao,
            inscritos: quantidadeInscritos,
            ultimaAtualizacao: curso.updated_at,
            topicos: curso.topicos,
            categorias: curso.categoria.map(categoria => categoria.nome),
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
                id,
            },
            include: {
                instrutores: true
            }
        })

        if (cursoExist === null) {
            return sendError(res, 404, { path: "id", message: messages.validationGeneric.notFound("id") })
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = cursoExist.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === cursoExist.criador

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, { path: "id", message: "Usuário sem permissão para deletar o curso!" })
            }
        }

        await prisma.$transaction(async (prisma) => {

            await prisma.progressoCurso.deleteMany({
                where: {
                    cursoId: id
                }
            })

            await prisma.inscricao.deleteMany({
                where: {
                    cursoId: id
                }
            })

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
            return sendError(res, 404, { path: "usuarioid", message: messages.validationGeneric.notFound("id") })
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
            return sendError(res, 404, { path: "cursoID", message: messages.validationGeneric.notFound("id") })
        }

        const instrutores = findCurso.instrutores.map(instrutor => instrutor.usuario)

        return sendResponse(res, 200, instrutores);
    }

    static async adicionarInstrutores(req, res) {
        const erros = [];
        const cursoID = req.params.id;
        const { usersID } = instrutorSchema.addInstrutorAoCurso.parse(req.body);

        // Verifica se o curso existe
        const findCurso = await prisma.curso.findUnique({
            where: {
                id: cursoID,
            },
            include: {
                instrutores: true
            }
        });

        if (!findCurso) {
            erros.push({ path: "cursoID", message: messages.validationGeneric.notFound("id do curso") });
        }

        // Verifica se cada usuário existe
        for (const user of usersID) {
            const findUser = await prisma.usuario.findUnique({
                where: {
                    id: user,
                }
            });

            if (!findUser) {
                erros.push({ path: "usersID", message: messages.validationGeneric.notFound(`ID do Usuário: ${user}`) });
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros);

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = findCurso.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === findCurso.criador

            if (!isCriador && !isInstrutor) {
                return sendError(res, 401, { path: "id", message: "Usuário sem permissão para adicionar instrutures ao curso!" })
            }
        }

        const instrutores = []
        await prisma.$transaction(async (prisma) => {

            for (const user of usersID) {
                instrutores.push(
                    await prisma.instrutores.create({
                        data: {
                            cursoId: cursoID,
                            userId: user
                        }
                    })
                )
            }
        })

        sendResponse(res, 201, instrutores)
    }

    static async uploadCapa(req, res) {
        const erros = []
        const validImageTypes = [
            'image/jpeg', 'image/jpg', 'image/png'
        ];

        const file = req.file
        const cursoid = req.params.id

        if (!validImageTypes.includes(file.mimetype)) {
            erros.push(`O arquivo enviado não é uma imagem válida, os tipos aceitos são: ${validImageTypes.join(", ")}!`)
        }

        const cursoExist = await prisma.curso.findUnique({
            where: {
                id: cursoid
            },
            include: {
                instrutores: true
            }
        })

        if (cursoExist === null) {
            erros.push({ path: "cursoid", message: messages.validationGeneric.notFound("id") })
        }

        if (erros.length > 0) {
            fs.unlinkSync(file.path);
            return sendError(res, 422, erros)
        }

        if (req.user.grupo === gruposEnum.Professores) {
            const userId = req.user.id;

            const isInstrutor = cursoExist.instrutores.some(instrutor => instrutor.userId === userId);
            const isCriador = userId === cursoExist.criador

            if (!isCriador && !isInstrutor) {
                fs.unlinkSync(file.path);
                return sendError(res, 401, { path: "id", message: "Usuário sem permissão para adicionar capa ao curso!" })
            }
        }

        const nomeImagem = await minioFunctions.upload(file, bucketsMinio.Cursos)

        await prisma.curso.update({
            where: {
                id: cursoid
            },
            data: {
                capa: nomeImagem
            }
        })

        if (cursoExist.capa) {
            await minioFunctions.remove(cursoExist.capa, bucketsMinio.Cursos)
                .catch()
        }

        return sendResponse(res, 201, [])
    }

    static async visualizarCapa(req, res) {
        const erros = []
        const cursoid = req.params.id

        const cursoExist = await prisma.curso.findUnique({
            where: {
                id: cursoid
            }
        })

        if (cursoExist === null) {
            erros.push({ path: "cursoid", message: messages.validationGeneric.notFound("id") })
        }

        if (erros.length > 0) {
            return sendError(res, 422, erros)
        }

        await minioFunctions.find(cursoExist.capa, bucketsMinio.Cursos)
            .then(image => {
                res.setHeader('Content-Type', 'image/*').status(200).end(image)
            })
            .catch(err => {
                return sendError(res, 404, err.message)
            })
    }
}
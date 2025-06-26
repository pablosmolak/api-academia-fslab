import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { pagination } from "../utils/pagination.js";
import minioFunctions from "../utils/minioFunctions.js";
import { bucketsMinio, gruposEnum } from "../utils/enums.js";
import fs from 'fs';
import { usuarioSchema } from "../schema/usuarioSchema.js";
import { EmailService } from "../services/emailService.js"


export default class UsuarioController {
    static async criarUsuario(req, res) {
        const erros = []
        let { nome, email, senha } = usuarioSchema.criarUsuario.parse(req.body)

        let userExist = await prisma.usuario.findUnique({
            where: { email }
        })

        if (userExist !== null) {
            erros.push({ path: "email", message: messages.auth.emailAlreadyExists() })
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const grupoId = await prisma.grupo.findFirst({
            where: {
                nome: { in: [gruposEnum.Alunos] },
            },
            select: { id: true },
        });

        const codigoVerificacao = Math.floor(100000 + Math.random() * 900000);

        const expirationInMs = 30 * 60 * 1000; // 30 minutos em milissegundos

        const userCreated = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: bcrypt.hashSync(senha, 10),
                grupoId: grupoId.id,
                codigoVerificacaoEmail: codigoVerificacao,
                expirationVerificacaoEmail: new Date(new Date().getTime() + expirationInMs)
            },
        });

        delete userCreated.senha;
        delete userCreated.codigoVerificacaoEmail;

        await EmailService.sendEmail({
            "subject": "Academia FSLab - Confirme o seu E-mail",
            "to": email,
            "template": "academia-verificaemail",
            "data": {
                "userName": nome,
                "verificationCode": `${codigoVerificacao}`
            }
        });

        return sendResponse(res, 201, userCreated);
    }

    static async listarUsuario(req, res) {
        let filtros = { where: {} }

        const { nome, email, pagina = 1, limite = 10 } = req.query

        if (nome) filtros.where.nome = { contains: nome }
        if (email) filtros.where.email = { contains: email }

        const paginacao = await pagination('usuario', pagina, limite, filtros)

        let userExists = await prisma.usuario.findMany({
            ...filtros,
            skip: paginacao.skip,
            take: paginacao.take,
            select: {
                id: true,
                nome: true,
                email: true,
                emailVerificado: true,
                fotoPerfil: true,
                ativo: true,
                grupoId: true,
                created_at: true,
                updated_at: true
            }
        })

        return sendResponse(res, 200, userExists,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take })
    }

    static async listarUsuarioPorID(req, res) {
        const erros = []

        const { id } = usuarioSchema.listarUsuario.parse(req.params)

        const findUser = await prisma.usuario.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                nome: true,
                email: true,
                emailVerificado: true,
                fotoPerfil: true,
                ativo: true,
                grupoId: true,
                created_at: true,
                updated_at: true,
                Grupo: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        })

        if (findUser === null) {
            erros.push(messages.auth.userNotFound(id))
        }

        if (erros.length > 0) return sendError(res, 404, erros)

        delete findUser.senha

        return sendResponse(res, 200, findUser)
    }

    static async alterarUsuario(req, res) {
        const erros = []

        const { id } = usuarioSchema.listarUsuario.parse(req.params)

        let { nome, email, senha } = usuarioSchema.alterarUsuario.parse({ ...req.body, id })

        const userExist = await prisma.usuario.findUnique({
            where: {
                id: id
            }
        })

        if (userExist === null) {
            erros.push({ path: "id", message: messages.auth.userNotFound(id) })
        }

        if (email) {
            let userExistByEmail = await prisma.usuario.findUnique({
                where: { email: email }
            })

            if (userExistByEmail !== null && userExistByEmail.id !== id) {
                erros.push({ path: "email", message: messages.auth.emailAlreadyExists(email) })
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        if (email) {
            if (userExist.email !== email) {
                const codigoVerificacao = Math.floor(100000 + Math.random() * 900000);

                const expirationInMs = 30 * 60 * 1000; // 30 minutos em milissegundos

                await prisma.usuario.update({
                    where: {
                        id: id,
                    },
                    data: {
                        emailVerificado: false,
                        codigoVerificacaoEmail: codigoVerificacao,
                        expirationVerificacaoEmail: new Date(new Date().getTime() + expirationInMs)
                    }
                });

                await EmailService.sendEmail({
                    "subject": "Academia FSLab - Confirme o seu E-mail",
                    "to": email,
                    "template": "academia-verificaemail",
                    "data": {
                        "userName": nome,
                        "verificationCode": `${codigoVerificacao}`
                    }
                });
            }

        }

        if (senha) senha = bcrypt.hashSync(senha, 10)

        await prisma.usuario.update({
            where: {
                id: id,
            },
            data: {
                nome,
                email,
                senha: senha
            },
        })

        return sendResponse(res, 200, [])
    }

    static async deletarUsuario(req, res) {
        const erros = []

        const { id: userId } = usuarioSchema.listarUsuario.parse(req.params)

        const userExist = await prisma.usuario.findUnique({
            where: {
                id: userId
            }
        })

        if (userExist === null) {
            erros.push(messages.auth.userNotFound(userId))
        }

        if (userExist?.email === process.env.LOGIN_ADMINISTRADOR_PADRAO) {
            erros.push("O usuário Administrador padrão não pode ser deletado!")
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        await prisma.$transaction(async (prisma) => {
            await prisma.curso.updateMany({
                where: { criador: userId },
                data: { criador: null },
            });

            await prisma.certificado.deleteMany({
                where: { userId },
            });

            await prisma.progressoCurso.deleteMany({
                where: { userId },
            });

            await prisma.inscricao.deleteMany({
                where: { userId },
            });

            await prisma.instrutores.deleteMany({
                where: { userId },
            });

            await prisma.usuario.delete({
                where: { id: userId },
            });
        });

        return sendResponse(res, 200, [])
    }

    static async uploadFotoPerfil(req, res) {
        const erros = []
        const validImageTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
        ];

        const file = req.file
        const { id: userid } = usuarioSchema.listarUsuario.parse(req.params)

        if (!validImageTypes.includes(file.mimetype)) {
            erros.push(`O arquivo enviado não é uma imagem válida, os tipos aceitos são: ${validImageTypes.join(", ")}!`)
        }

        const userExist = await prisma.usuario.findUnique({
            where: {
                id: userid
            }
        })

        if (userExist === null) {
            erros.push(messages.auth.userNotFound(userid))
        }

        if (erros.length > 0) {
            fs.unlinkSync(file.path);
            return sendError(res, 422, erros)
        }

        const nomeImagem = await minioFunctions.upload(file, bucketsMinio.Usuarios)

        await prisma.usuario.update({
            where: {
                id: userid
            },
            data: {
                fotoPerfil: nomeImagem
            }
        })

        if (userExist.fotoPerfil) {
            await minioFunctions.remove(userExist.fotoPerfil, bucketsMinio.Usuarios)
                .catch()
        }

        return sendResponse(res, 201, [])
    }

    static async deletarFotoPerfil(req, res) {
        const erros = []
        const { id: userid } = usuarioSchema.listarUsuario.parse(req.params)

        const userExist = await prisma.usuario.findUnique({
            where: {
                id: userid
            }
        })

        if (userExist === null) {
            erros.push({ path: "id", message: messages.auth.userNotFound(userid) })
        }

        if (erros.length > 0) {
            return sendError(res, 422, erros)
        }

        if (userExist.fotoPerfil) {
            await minioFunctions.remove(userExist.fotoPerfil, bucketsMinio.Usuarios)
                .catch()

            await prisma.usuario.update({
                where: {
                    id: userid
                },
                data: {
                    fotoPerfil: null
                }
            })
        }

        return sendResponse(res, 200, [])
    }

    static async visualizarImagem(req, res) {
        const erros = []
        const { id: userid } = usuarioSchema.listarUsuario.parse(req.params)

        const userExist = await prisma.usuario.findUnique({
            where: {
                id: userid
            }
        })

        if (userExist === null) {
            erros.push(messages.auth.userNotFound(userid))
        }

        if (erros.length > 0) {
            return sendError(res, 422, erros)
        }

        await minioFunctions.find(userExist.fotoPerfil, bucketsMinio.Usuarios)
            .then(image => {
                res.setHeader('Content-Type', 'image/*').status(200).end(image)
            })
            .catch(err => {
                return sendError(res, 404, err.message)
            })
    }
}
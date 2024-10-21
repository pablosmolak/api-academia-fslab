import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { validarEmail, validarSenha } from "../utils/validations.js";
import { pagination } from "../utils/pagination.js";
import minioFunctions from "../utils/minioFunctions.js";
import { bucketsMinio } from "../utils/enums.js";
import fs from 'fs';
import { usuarioSchema } from "../schema/usuarioSchema.js";

export default class UsuarioController {
    static async criarUsuario(req, res) {
        let { nome, email, senha, fotoPerfil } = usuarioSchema.criarUsuario.parse(req.body)

        const grupoId = await prisma.grupo.findFirst({
            where: {
                nome: { in: ["Cursantes"] },
            },
            select: { id: true },
        });

        const userCreated = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: bcrypt.hashSync(senha, 10),
                fotoPerfil,
                grupoId: grupoId.id
            },
        });

        // retornar o usuario criado sem o campo senha
        delete userCreated.senha;

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
            take: paginacao.take
        })

        for (let user of userExists) {
            delete user.senha
        }

        return sendResponse(res, 200, userExists,
            { pagina: paginacao.paginaAtual, totalPaginas: paginacao.totalPaginas, limite: paginacao.take })
    }

    static async listarUsuarioPorID(req, res) {
        const erros = []

        const { id } = req.params

        const findUser = await prisma.usuario.findUnique({
            where: {
                id: id
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

        const { id } = req.params

        let { nome, email, senha, fotoPerfil } = req.body

        if (nome) {
            if (nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (email && validarEmail(email, erros)) {
            let userExist = await prisma.usuario.findUnique({
                where: { email: email }
            })

            if (userExist !== null && userExist.id !== id) {
                erros.push(messages.auth.emailAlreadyExists(user.email))
            }
        }

        if (senha) {
            validarSenha(senha, erros)
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        if (senha) senha = bcrypt.hashSync(senha, 10)

        await prisma.usuario.update({
            where: {
                id: id,
            },
            data: {
                nome,
                email,
                senha: senha,
                fotoPerfil
            },
        })

        return sendResponse(res, 200, [])
    }

    static async deletarUsuario(req, res) {
        const erros = []

        const { id } = req.params

        if (!id) {
            erros.push(messages.error.invalidID)
        } else {
            const userExist = await prisma.usuario.findUnique({
                where: {
                    id
                }
            })

            if (userExist === null) {
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        await prisma.usuario.delete({
            where: {
                id: id,
            },
        })

        return sendResponse(res, 200, [])
    }

    static async uploadFotoPerfil(req, res) {
        const erros = []
        const validImageTypes = [
            'image/jpeg', 'image/jpg', 'image/png'
        ];

        const file = req.file
        const userid = req.params.id

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

        const userUpdated = await prisma.usuario.update({
            where: {
                id: userid
            },
            data: {
                fotoPerfil: nomeImagem
            }
        })

        if (userUpdated) {
            await minioFunctions.remove(userExist.fotoPerfil, bucketsMinio.Usuarios)
        }

        return sendResponse(res, 201, [])
    }

    static async visualizarImagem(req, res) {
        const erros = []
        const userid = req.params.id

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
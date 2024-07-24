import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";
import messages, { sendError, sendResponse } from "../utils/mensagens.js";
import { validarEmail, validarSenha } from "../utils/validations.js";

export default class UsuarioController {
    static async criarUsuario(req, res) {
        const erros = []
        let { nome, email, senha, fotoPerfil } = req.body

        if (!nome) {
            erros.push(messages.validationGeneric.fieldIsRequired("Nome"))
        } else {
            if (nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (!email) {
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        } else if (validarEmail(email, erros)) {
            let userExist = await prisma.usuario.findUnique({
                where: { email: email }
            })

            if (userExist !== null) {
                erros.push(messages.auth.emailAlreadyExists(email))
            }
        }

        if (!senha) {
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        } else {
            validarSenha(senha, erros)
        }

        if (erros.length > 0) return sendError(res,422,erros)

        const grupoId = await prisma.grupo.findFirst({
            where: {
                nome: { in: ["Cursantes"] },
            },
            select: {id: true},
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

        const { nome, email } = req.query

        if (nome) filtros.where.nome = { contains: nome }
        if (email) filtros.where.email = { contains: email }

        let userExists = await prisma.usuario.findMany(filtros)

        for (let user of userExists) {
            delete user.senha
        }

        return sendResponse(res, 200, userExists);
    }

    static async listarUsuarioPorID(req, res) {
        const erros = []

        let userExist

        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            userExist = await prisma.usuario.findUnique({
                where: {
                    id:id
                }
            })

            if(userExist === null){
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) return sendError(res,404,erros)

        delete userExist.senha  

        return sendResponse(res, 200, userExist)
    }

    static async alterarUsuario(req, res) {
        const erros = []
        
        const {id} = req.params
        let { nome, email, senha, fotoPerfil } = req.body


        if (user.nome) {
            if (nome.length < 3) {
                erros.push(messages.customValidation.lengthMaior("Nome", 3))
            } else if (nome.length > 200) {
                erros.push(messages.customValidation.lengthMenor("Nome", 200))
            }
        }

        if (user.email && this.utils.validarEmail(user.email, erros)) {
            let userExist = await prisma.usuario.findUnique({
                where: { email: email }
            })

            if (userExist !== null && userExist.id !== id) {
                erros.push(messages.auth.emailAlreadyExists(user.email))
            }
        }

        if (user.senha) {
            this.utils.validarSenha(user.senha, erros)
        }

        if (erros.length > 0) return sendError(res,422,erros)

        if(senha) senha = bcrypt.hashSync(senha, 10)

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
        const erros= []
        
        const {id} = req.params
 
        if (!id) {
            erros.push(messages.error.invalidID)
        }else{
            const userExist = await prisma.usuario.findUnique({
                where: {
                    id
                }
            })

            if(userExist === null){
                erros.push(messages.auth.userNotFound(id))
            }
        }

        if (erros.length > 0) sendError(res,422,erros)

        await prisma.usuario.delete({
            where: {
                id: id,
            },
        })

        return sendResponse(res, 200, [])
    }
}
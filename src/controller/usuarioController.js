import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";
import { sendResponse } from "../utils/mensagens.js";

export default class UsuarioController {
    static async criarUsuario(req, res) {
        let { nome, email, senha } = req.body

        const userCreated = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: bcrypt.hashSync(senha, 10)
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

        const usuarioCorreto = []
        for (let user of userExists) {
            delete user.senha
            usuarioCorreto.push(user)
        }

        return sendResponse(res, 200, usuarioCorreto);
    }

    static async listarUsuarioPorID(req, res) {
        const id = req.params.id

        let findUser = await prisma.usuario.findUnique({
            where: {
                id: id
            }
        })

        delete findUser.senha

        return sendResponse(res, 200, findUser)

    }

    static async deletarUsuario(req, res) {
        const id = req.params.id

        await prisma.usuario.delete({
            where: {
                id: id,
            },
        })

        return sendResponse(res, 200, [])
    }
}
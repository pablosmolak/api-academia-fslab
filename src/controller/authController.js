import jwt from "jsonwebtoken"
import messages, { sendError, sendResponse } from "../utils/mensagens.js"
import { prisma } from "../config/prismaClient.js"
import { validarEmail } from "../utils/validations.js"
import bcript from "bcryptjs"

import SaveImageToWeb from "../utils/SaveImageToWeb.js"
import minioFunctions from "../utils/minioFunctions.js"
import { bucketsMinio, gruposEnum } from "../utils/enums.js"

export default class AuthController {
    static async logar(req, res) {
        const erros = []

        const { email, senha } = req.body

        if (!email) {
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        } else {
            validarEmail(email, erros)
        }

        if (!senha) {
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        }

        if (erros.length > 0) return sendError(res, 422, erros)

        const findUser = await prisma.usuario.findUnique({
            where: { email: email },
            include: {
                Grupo: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        if (findUser === null) return sendError(res, 401, ["Usuário ou senha incorretos!"])

        const senhaValida = await bcript.compare(senha, findUser.senha)

        if (!senhaValida) return sendError(res, 401, ["Usuário ou senha incorretos!"])

        if (!findUser.ativo) return sendError(res, 401, ["Usuário ou senha incorretos!"])

        const token = jwt.sign(
            {
                id: findUser.id,
                name: findUser.nome,
                email: findUser.email,
                ativo: findUser.ativo,
                grupo: findUser.Grupo.nome,
                emailVerificado: findUser.emailVerificado
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        )

        const payload = jwt.decode(token);

        return sendResponse(res, 200, {
            token: token,
            payload: payload
        })
    }

    static async logarGithub(req, res) {
        const { access_token } = req.body

        const githubInfos = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": `token ${access_token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Bad credentials") {
                    return sendError(res, 401, ["Usuário ou senha incorretos!"])
                }

                return data
            })
            .catch(error => {
                return sendError(res, 401, ["Usuário ou senha incorretos!"])
            });

        const githubEmail = await fetch("https://api.github.com/user/emails", {
            method: "GET",
            headers: {
                "Authorization": `token ${access_token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Bad credentials") {
                    return sendError(res, 401, ["Usuário ou senha incorretos!"])
                }

                const email = data.filter(email => email.primary === true)
                    .map(email => email.email)
                    .join('')

                return email
            })
            .catch(error => {
                return sendError(res, 401, ["Usuário ou senha incorretos!"])
            });

        let findUser = await prisma.usuario.findUnique({
            where: { email: githubEmail },
            include: {
                Grupo: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        if (findUser === null) {

            const user = {
                nome: githubInfos.name,
                email: githubEmail,
                fotoPerfil: githubInfos.avatar_url
            }

            findUser = await criarUsuario(user)
        }

        const token = {
            token: jwt.sign(
                {
                    id: findUser.id,
                    nome: findUser.nome,
                    email: findUser.email,
                    ativo: findUser.ativo,
                    grupo: findUser.Grupo.nome
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION }
            )
        }

        res.status(200).json(token)
    }
}

async function criarUsuario(user) {

    const imagePath = await SaveImageToWeb(user.fotoPerfil)

    const imagem = await minioFunctions.upload(imagePath, bucketsMinio.Usuarios)

    const grupoId = await prisma.grupo.findFirst({
        where: {
            nome: { in: [gruposEnum.Alunos] },
        },
        select: { id: true },
    });

    const usuario = await prisma.usuario.create({
        data: {
            nome: user.nome,
            email: user.email,
            fotoPerfil: imagem,
            grupoId: grupoId.id
        }
    })

    return ({ ...usuario, Grupo: { nome: gruposEnum.Alunos } })

}
import jwt from "jsonwebtoken"
import messages, { sendError } from "../utils/mensagens.js"
import { prisma } from "../config/prismaClient.js"
import { validarEmail } from "../utils/validations.js"
import bcript from "bcryptjs"
import criarUsuario from "../utils/criarUsuario.js"

export default class AuthController {
    static async logar(req, res) {
        const erros = []

        const {email,senha} = req.body

        if (!email) {
            erros.push(messages.validationGeneric.fieldIsRequired("E-mail"))
        } else {
            validarEmail(email,erros)
        }

        if (!senha) {
            erros.push(messages.validationGeneric.fieldIsRequired("Senha"))
        }

        if (erros.length > 0) sendError(res, 422, erros)

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

        if (findUser === null) return sendError(res,401, ["Usuário ou senha incorretos!"])

        if (!(await bcript.compare(senha, findUser.senha))) return sendError(res,401, ["Usuário ou senha incorretos!"])

        if (!findUser.ativo) return sendError(res,401, ["Usuário ou senha incorretos!"])

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

    static async logarGithub(req,res){
        const {token} = req.body

        fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
              "Authorization": `token ${token.githubAccessToken}`,
              "Accept": "application/vnd.github.v3+json"
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.message === "Bad credentials") {
                console.log("Token inválido ou expirado!");
              } else {
                console.log("Informações do usuário:", data);
              }
            })
            .catch(error => console.error("Erro na requisição:", error));

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

        if (findUser === null) {
            criarUsuario(token)
        }



    }
}
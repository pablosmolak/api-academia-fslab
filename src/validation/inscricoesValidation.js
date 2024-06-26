import { Validador, funcoesDeValidacao as func } from "../utils/validation.js";
import { sendError, messages } from "../utils/mensagens.js";

export default class inscricaoValidation {
    static async criarInscricao(req, res, next) {

        let validador = new Validador(req.body)

        await validador.validacao("cursoId", func.Obrigatorio(), func.Existe({ tabela: "Curso", query: { where: { id: { contains: req.body.cursoId } } } }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        await validador.validacao("Id", func.UnicoVerificaNoID({
            tabela: "inscricao",
            query: {
                where: {
                    userId_cursoId: {
                        userId: req.user.id,
                        cursoId: req.body.cursoId,
                    },
                }
            },
            message: "Já existe uma inscrição neste curso para o usuário"
        }))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async listarInscricoesPorId(req, res, next) {

        let validador = new Validador(req.params)

        await validador.validacao("id", func.Obrigatorio(), func.UUID({message: messages.error.invalidID}),func.Existe({ tabela: "inscricao"}))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }

    static async DeletarInscricao(req, res, next) {

        let validador = new Validador(req.params)

        await validador.validacao("id", func.Obrigatorio(), func.UUID({message: messages.error.invalidID}),func.Existe({ tabela: "inscricao"}))

        if (validador.contemErros()) return sendError(res, 422, validador.obterErros())

        return next()
    }
}  
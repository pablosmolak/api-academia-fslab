import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const InscricaoPath = {
    "/inscricoes": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todas as Inscrições",
            description: "Recupera uma lista de todas as inscrições no sistema.",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        },
        post: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Criar Nova Inscrição",
            description: "Cria uma nova inscrição com as informações fornecidas.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/InscricaoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    },
    "/inscricoes/{id}": {
        delete: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Excluir Inscrição",
            description: "Remove uma inscrição do sistema, identificada pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da inscrição a ser excluída.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    }
}

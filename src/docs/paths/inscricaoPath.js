import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const InscricaoPath = {
    "/inscricoes": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todas as Inscrições",
            description: "Recupera uma lista de todas as inscrições no sistema.",
            parameters: [
                {
                    name: "cursoId",
                    in: "query",
                    description: "Filtra a inscrição pelo id do curso.",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "usuarioId",
                    in: "query",
                    description: "Filtra a inscrição pelo id do usuário inscrito.",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "pagina",
                    in: "query",
                    description: "Número da página de resultados da pesquisa",
                    required: false,
                    schema: {
                        type: "integer",
                        default: 1,
                        minimum: 1
                    }
                },
                {
                    name: "limite",
                    in: "query",
                    description: "Quantidade máxima de resultados por página",
                    required: false,
                    schema: {
                        type: "integer",
                        default: 10,
                        minimum: 1,
                        maximum: 100
                    }
                }
            ],
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
    },
    "/inscricoes/usuario": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todas as Inscrições do usuário logado",
            description: "Recupera uma lista de todas as inscrições do usuário logado.",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/inscricoes/usuario/curso/{cursoId}": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Inscrições do usuário logado por id de curso",
            description: "Recupera uma inscrições do usuário logado por curso.",
            parameters: [
                {
                    name: "cursoId",
                    in: "path",
                    description: "ID do curso.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    }
}

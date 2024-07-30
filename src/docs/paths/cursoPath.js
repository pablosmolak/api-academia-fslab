import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CursoPath = {
    "/cursos": {
        get: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todos os Cursos",
            description: "Recupera uma lista de todos os cursos disponíveis no sistema.",
            parameters: [
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
                ...gerarRespostasCorretas(200, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        },
        post: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Criar Novo Curso",
            description: "Cria um novo curso com as informações fornecidas.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CursoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    },
    "/cursos/{id}": {
        get: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Curso por ID",
            description: "Recupera os detalhes de um curso específico identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso a ser recuperado.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Excluir Curso",
            description: "Remove um curso do sistema, identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso a ser excluído.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "", true),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    },
    "/cursos/inscricoes/usuario/{usuarioid}": {
        get: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Cursos por ID do Usuário",
            description: "Recupera todos os cursos nos quais um usuário específico está inscrito, identificado pelo ID do usuário.",
            parameters: [
                {
                    name: "usuarioid",
                    in: "path",
                    description: "ID do usuário cujas inscrições devem ser recuperadas.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
    }
}
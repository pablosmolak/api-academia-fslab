import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const ConteudoPath = {
    "/conteudos": {
        post: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Adicionar Novo Conteúdo",
            description: "Cria um novo conteúdo com base nos dados fornecidos pelo usuário. O corpo da requisição deve conter as informações necessárias para a criação do conteúdo.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ConteudoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Conteudo"),
                ...gerarRespostasDeErro([401,403, 422, 498, 500])
            }
        }
    },
    "/conteudos/{id}": {
        get: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Detalhes de Conteúdo",
            description: "Recupera os detalhes de um conteúdo específico identificado pelo ID fornecido, permitindo que os usuários visualizem informações detalhadas sobre o conteúdo.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do conteúdo a ser obtido",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Conteudo"),
                ...gerarRespostasDeErro([401, 403,422, 498, 500])
            }
        },
        patch: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Atualizar Conteúdo Existente",
            description: "Atualiza as informações de um conteúdo específico identificado pelo ID. Os novos dados do conteúdo devem ser fornecidos no corpo da requisição.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do conteúdo a ser atualizado",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ConteudoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([401, 403,422, 498, 500])
            }
        },
        delete: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Remover Conteúdo",
            description: "Deleta um conteúdo específico identificado pelo ID fornecido. Esta operação é irreversível e removerá o conteúdo permanentemente do sistema.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do conteúdo a ser deletado",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([401, 403,422, 498, 500])
            }
        },
    },
    "/conteudos/topico/{topicoid}": {
        get: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Conteúdos por ID de Tópico",
            description: "Recupera os conteúdos associados a um tópico específico identificado pelo ID fornecido, permitindo que os usuários visualizem informações detalhadas sobre os conteúdos relacionados ao tópico.",
            parameters: [
                {
                    name: "topicoid",
                    in: "path",
                    description: "ID do tópico",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Conteudo"),
                ...gerarRespostasDeErro([401,403, 422, 498, 500])
            }
        }
    }
};

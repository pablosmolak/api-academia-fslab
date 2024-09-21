import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CategoriaPath = {
    "/categorias": {
        get: {
            tags: ["Categorias"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Lista de Categorias",
            description: "Retorna uma lista de todas as categorias disponíveis, permitindo aos usuários visualizar todas as opções de categorias.",
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        },
        post: {
            tags: ["Categorias"],
            security: [{ jwtAuth: [] }],
            summary: "Adicionar Nova Categoria",
            description: "Cria uma nova categoria com base nos dados fornecidos pelo usuário. O corpo da requisição deve conter as informações necessárias para a criação da categoria.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CategoriaRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    },
    "/categorias/{id}": {
        get: {
            tags: ["Categorias"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Detalhes de Categoria",
            description: "Recupera os detalhes de uma categoria específica identificada pelo ID fornecido, permitindo aos usuários visualizar informações detalhadas sobre a categoria.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da categoria a ser obtida",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
        patch: {
            tags: ["Categorias"],
            security: [{ jwtAuth: [] }],
            summary: "Atualizar Categoria Existente",
            description: "Atualiza as informações de uma categoria específica identificada pelo ID. Os novos dados da categoria devem ser fornecidos no corpo da requisição.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da categoria a ser atualizada",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CategoriaRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Categorias"],
            security: [{ jwtAuth: [] }],
            summary: "Remover Categoria",
            description: "Deleta uma categoria específica identificada pelo ID fornecido. Esta operação é irreversível e removerá a categoria permanentemente do sistema.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da categoria a ser deletada",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "", true),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    }
}

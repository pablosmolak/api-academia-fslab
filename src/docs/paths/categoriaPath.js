import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CategoriaPath = {
    "/categorias": {
        get: {
            tags: ["Categorias"],
            summary: "Listar Categorias",
            description: "Retorna uma lista de todas as categorias disponíveis.",
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 498, 500])
            }
        },
        post: {
            tags: ["Categorias"],
            summary: "Criar Categoria",
            description: "Cria uma nova categoria. É necessário fornecer os dados da categoria no corpo da requisição.",
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
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    },
    "/categorias/{id}": {
        get: {
            tags: ["Categorias"],
            summary: "Obter Categoria por ID",
            description: "Retorna uma categoria específica identificada pelo ID.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da categoria",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
        patch: {
            tags: ["Categorias"],
            summary: "Atualizar Categoria",
            description: "Atualiza as informações de uma categoria específica identificada pelo ID. É necessário fornecer os novos dados da categoria no corpo da requisição.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da categoria",
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
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Categorias"],
            summary: "Deletar Categoria",
            description: "Remove uma categoria específica identificada pelo ID.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID da categoria",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "", true),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    }
}

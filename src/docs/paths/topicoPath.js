import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const TopicoPath = {
    "/topicos": {
        post: {
            tags: ["Tópicos"],
            summary: "Criar tópico",
            description: "Cria um novo topico",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/TopicoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201,"#/components/schemas/Topico"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    },
    "/topicos/{id}": {
        get: {
            tags: ["Tópicos"],
            summary: "Obter tópico por ID",
            description: "Retorna um tópico por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do tópico",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200,"#/components/schemas/Topico"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
        patch: {
            tags: ["Tópicos"],
            summary: "Atualizar tópico",
            description: "Atualiza um tópico por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do tópico",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/TopicoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200,"#/components/schemas/Topico"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Tópicos"],
            summary: "Deletar tópico",
            description: "Deleta um tópico por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do tópico",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200,"",true),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    },
    "/topicos/curso/{cursoid}": {
        get: {
            tags: ["Tópicos"],
            summary: "Obter tópico por ID do curso",
            description: "Retorna um tópico por ID do curso",
            parameters: [
                {
                    name: "cursoid",
                    in: "path",
                    description: "ID do curso",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200,"#/components/schemas/Topico"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    }
}
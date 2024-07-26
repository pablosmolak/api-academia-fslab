import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CursoPath = {
    "/cursos": {
        get: {
            tags: ["Cursos"],
            summary: "Listar Curso",
            description: "Lista todos os cursos",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200,"#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 498, 500])
            }
        },
        post: {
            tags: ["Cursos"],
            summary: "Criar curso",
            description: "Cria um novo curso",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CursoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201,"#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    },
    "/cursos/{id}": {
        get: {
            tags: ["Cursos"],
            summary: "Obter curso por ID",
            description: "Retorna um curso por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200,"#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Cursos"],
            summary: "Deletar curso",
            description: "Deleta um curso por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso",
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
    "/cursos/inscricoes/usuario/{usuarioid}": {
        get: {
            tags: ["Cursos"],
            summary: "Obter curso por ID",
            description: "Retorna um curso por ID do usuário",
            parameters: [
                {
                    name: "usuarioid",
                    in: "path",
                    description: "ID do usuario",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200,"#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
    }   
}
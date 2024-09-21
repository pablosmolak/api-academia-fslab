import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const ProgressoPath = {
    "/progressos": {
        get: {
            tags: ["Progressos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todos os Progressos de Curso",
            description: "Recupera uma lista de todos os progressos de curso no sistema.",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/ProgressoCurso"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/progressos/finalizaratividade/{conteudoid}": {
        post: {
            tags: ["Progressos"],
            security: [{ jwtAuth: [] }],
            summary: "Finalizar Atividade",
            description: "Marca uma atividade específica como concluída no progresso de curso.",
            parameters: [
                {
                    name: "conteudoid",
                    in: "path",
                    description: "ID do conteúdo da atividade a ser finalizada.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/ProgressoCurso"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    }
}

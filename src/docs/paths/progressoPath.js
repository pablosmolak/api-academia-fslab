import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const ProgressoPath = {
    "/progressos": {
        get: {
            tags: ["Progressos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todos os Progressos de Curso",
            description: "Recupera uma lista de todos os progressos de curso registrados no sistema.<br>" +
                "Se o usuário for um Administrador, ele pode visualizar os progressos de qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode visualizar os progressos dos cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
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
                ...gerarRespostasCorretas(200, "#/components/schemas/ProgressoCurso"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/progressos/curso/{cursoId}": {
        get: {
            tags: ["Progressos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar o Progresso do usuario logado no Curso",
            description: "Recupera o progresso do usuário logado no curso informado.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [
                {
                    name: "cursoId",
                    in: "path",
                    description: "ID do curso.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
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
            summary: "Finalizar Atividade do usuário logado em um curso",
            description: "Marca uma atividade específica como concluída no progresso de curso.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
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

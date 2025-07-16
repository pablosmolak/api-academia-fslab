import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const TopicoPath = {
    "/topicos": {
        post: {
            tags: ["Tópicos"],
            security: [{ jwtAuth: [] }],
            summary: "Criar Novo Tópico",
            description: "Cria um novo tópico no sistema com base nos dados fornecidos.<br>" +
                "Se o usuário for um Administrador, ele pode criar tópicos em qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode criar tópicos em cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/TopicoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Topico"),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    },
    "/topicos/{id}": {
        get: {
            tags: ["Tópicos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Tópico por ID",
            description: "Recupera as informações de um tópico específico, identificado pelo ID fornecido.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do tópico a ser recuperado.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Topico"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
        patch: {
            tags: ["Tópicos"],
            security: [{ jwtAuth: [] }],
            summary: "Atualizar Tópico",
            description: "Atualiza as informações de um tópico existente, identificado pelo ID fornecido.<br>" +
                "Se o usuário for um Administrador, ele pode atualizar tópicos de qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode atualizar tópicos de cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do tópico a ser atualizado.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/TopicoUpdateRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Topico"),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Tópicos"],
            security: [{ jwtAuth: [] }],
            summary: "Excluir Tópico",
            description: "Remove um tópico do sistema, identificado pelo ID fornecido.<br>" +
                "Se o usuário for um Administrador, ele pode remover tópicos de qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode remover tópicos de cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do tópico a ser excluído.",
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
    "/topicos/curso/{cursoid}": {
        get: {
            tags: ["Tópicos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Tópicos por ID do Curso",
            description: "Recupera todos os tópicos associados a um curso específico, identificado pelo ID do curso.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [
                {
                    name: "cursoid",
                    in: "path",
                    description: "ID do curso para o qual os tópicos devem ser recuperados.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Topico"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    }
}
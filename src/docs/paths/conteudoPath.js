import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const ConteudoPath = {
    "/conteudos": {
        post: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Adicionar Novo Conteúdo",
            description: "Cria um novo conteúdo com base nos dados fornecidos pelo usuário. O corpo da requisição deve conter as informações necessárias para a criação do conteúdo.<br>" +
                "Se o usuário for um Administrador, ele pode criar conteúdos em qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode criar conteúdos em cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
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
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    },
    "/conteudos/{id}": {
        get: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Detalhes de Conteúdo",
            description: "Recupera os detalhes de um conteúdo específico identificado pelo ID fornecido, permitindo que os usuários visualizem informações detalhadas sobre o conteúdo.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
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
                ...gerarRespostasDeErro([401, 403, 404, 422, 498, 500])
            }
        },
        patch: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Atualizar Conteúdo Existente",
            description: "Atualiza as informações de um conteúdo específico identificado pelo ID. Os novos dados do conteúdo devem ser fornecidos no corpo da requisição.<br>" +
                "Se o usuário for um Administrador, ele pode atualizar conteúdos de qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode atualizar conteúdos de cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
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
                        schema: { $ref: "#/components/schemas/ConteudoUpdateRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Remover Conteúdo",
            description: "Deleta um conteúdo específico identificado pelo ID fornecido. Esta operação é irreversível e removerá o conteúdo permanentemente do sistema.<br>" +
                "Se o usuário for um Administrador, ele pode deletar conteúdos de qualquer curso.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode deletar conteúdos de cursos que criou ou nos quais é instrutor.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
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
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
    },
    "/conteudos/topico/{topicoid}": {
        get: {
            tags: ["Conteúdos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Conteúdos por ID de Tópico",
            description: "Recupera os conteúdos associados a um tópico específico identificado pelo ID fornecido, permitindo que os usuários visualizem informações detalhadas sobre os conteúdos relacionados ao tópico.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
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
                ...gerarRespostasDeErro([401, 403, 404, 422, 498, 500])
            }
        }
    }
};
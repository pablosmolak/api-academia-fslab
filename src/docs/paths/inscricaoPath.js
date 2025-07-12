import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const InscricaoPath = {
    "/inscricoes": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todas as Inscrições",
            description: "Recupera uma lista de todas as inscrições registradas no sistema.<br>" +
                "Se o usuário for um Administrador, ele pode visualizar todas as inscrições.<br>" +
                "Se o usuário for um Ministrante (Professor), ele só pode visualizar inscrições dos cursos que criou ou nos quais é instrutor.<br><br>" +
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
                ...gerarRespostasCorretas(200, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        },
        post: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Criar Nova Inscrição",
            description: "Cria uma nova inscrição com as informações fornecidas.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/InscricaoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    },
    "/inscricoes/usuario": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todas as Inscrições do usuário logado",
            description: "Recupera uma lista de todas as inscrições do usuário logado.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/inscricoes/usuario/curso/{cursoId}": {
        get: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Inscrições do usuário logado por id de curso",
            description: "Recupera uma inscrição do usuário logado em um curso específico.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [
                {
                    name: "cursoId",
                    in: "path",
                    description: "ID do curso.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Inscricao"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        },
        delete: {
            tags: ["Inscrições"],
            security: [{ jwtAuth: [] }],
            summary: "Excluir Inscrição",
            description: "Remove uma inscrição do usuário logado no sistema com base no ID do curso fornecido.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [
                {
                    name: "cursoId",
                    in: "path",
                    description: "ID do curso da inscrição a ser excluída.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    }
}

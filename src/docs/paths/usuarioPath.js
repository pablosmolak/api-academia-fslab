import messages from "../../utils/mensagens.js";
import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const UsuarioPath = {
    "/usuarios": {
        get: {
            tags: ["Usuários"],
            security: [{jwtAuth: []}],
            summary: "Obter Lista de Usuários",
            description: "Recupera uma lista de todos os usuários cadastrados, com possibilidade de filtragem por nome e e-mail.",
            parameters: [
                {
                    name: "nome",
                    in: "query",
                    description: "Filtra os usuários pelo nome.",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "email",
                    in: "query",
                    description: "Filtra os usuários pelo e-mail.",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Usuario"),
                ...gerarRespostasDeErro([401, 498, 500])
            },
        },
        post: {
            tags: ["Usuários"],
            summary: "Registrar Novo Usuário",
            description: "Cria um novo usuário no sistema com os dados fornecidos.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UsuarioRequestBody"
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Usuario"),
                ...gerarRespostasDeErro([422, 500])
            }
        },
    },
    "/usuarios/{id}": {
        get: {
            tags: ["Usuários"],
            security: [{jwtAuth: []}],
            summary: "Obter Detalhes do Usuário",
            description: "Recupera as informações de um usuário específico, identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser recuperado.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Usuario"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            },
        },
        patch: {
            tags: ["Usuários"],
            security: [{jwtAuth: []}],
            summary: "Atualizar Informações do Usuário",
            description: "Atualiza os dados de um usuário existente, identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser atualizado.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UsuarioRequestBody"
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Usuario"),
                ...gerarRespostasDeErro([401, 422, 498, 500]),
            }
        },
        delete: {
            tags: ["Usuários"],
            security: [{jwtAuth: []}],
            summary: "Excluir Usuário",
            description: "Remove um usuário do sistema, identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser excluído.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "", true),
                ...gerarRespostasDeErro([401, 422, 498, 500]),
            }
        }
    }
}

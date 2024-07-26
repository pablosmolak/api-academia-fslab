import messages from "../../utils/mensagens.js";
import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const UsuarioPath = {
    "/usuarios": {
        get: {
            tags: ["Usuários"],
            summary: "Listar Usuários",
            description: "Lista todos os usuários",
            parameters: [
                {
                    name: "nome",
                    in: "query",
                    description: "Nome do usuário",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "email",
                    in: "query",
                    description: "E-mail do usuário",
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
            summary: "Criar Usuário",
            description: "Cria um novo usuário",
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
            summary: "Obter Usuário por ID",
            description: "Retorna um usuário por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Usuario"),
                ...gerarRespostasDeErro([401, 422, 498, 500])

            },
        },
        patch: {
            tags: ["Usuários"],
            summary: "Atualizar Usuário",
            description: "Atualiza um usuário",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário",
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
            summary: "Deletar Usuário",
            description: "Deleta um usuário por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário",
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
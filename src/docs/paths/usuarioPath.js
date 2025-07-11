import messages from "../../utils/mensagens.js";
import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const UsuarioPath = {
    "/usuarios": {
        get: {
            tags: ["Usuários"],
            summary: "Obter Lista de Usuários",
            description: "Recupera uma lista de todos os usuários cadastrados, com possibilidade de filtragem por nome e e-mail.<br>" +
                "O endpoint permite a listagem completa e aplicação de filtros conforme os parâmetros fornecidos.<br><br>" +
                 "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>"+
                "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
            parameters: [
                {
                    name: "nome",
                    in: "query",
                    description: "Filtra os usuários pelo nome",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "email",
                    in: "query",
                    description: "Filtra os usuários pelo e-mail",
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
                ...gerarRespostasCorretas(200, "#/components/schemas/Usuario"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            },
        },
        post: {
            tags: ["Usuários"],
            summary: "Registrar Novo Usuário",
            description: "Cria um novo usuário no sistema com base nos dados fornecidos pelo usuário.<br>" +
                "O corpo da requisição deve conter as informações necessárias para o cadastro do usuário.",
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
                ...gerarRespostasDeErro([400, 422, 500])
            }
        },
    },
    "/usuarios/{id}": {
        get: {
            tags: ["Usuários"],
            summary: "Obter Detalhes do Usuário",
            description: "Recupera as informações de um usuário específico, identificado pelo ID fornecido.<br>" +
                "O ID deve ser passado como parâmetro na URL da requisição.<br><br>" +
                "<strong>Permissões necessárias:</strong> Administrador, Ministrante ou o próprio usuário (ao consultar suas próprias informações).",
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
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            },
        },
        patch: {
            tags: ["Usuários"],
            security: [{ jwtAuth: [] }],
            summary: "Atualizar Informações do Usuário",
            description: "Atualiza os dados de um usuário existente, identificado pelo ID fornecido.<br>" +
                "O corpo da requisição deve conter as informações que serão atualizadas.<br><br>" +
                "<strong>Permissões necessárias:</strong> Administrador ou o próprio usuário (ao atualizar suas próprias informações).",
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
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500]),
            }
        },
        delete: {
            tags: ["Usuários"],
            security: [{ jwtAuth: [] }],
            summary: "Excluir Usuário",
            description: "Remove um usuário do sistema, identificado pelo ID fornecido.<br><br>" +
             "<strong>Permissões necessárias:</strong> Administrador ou o próprio usuário (ao remover sua própria conta).",
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
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500]),
            }
        }
    },
    "/usuarios/{id}/image/upload": {
        post: {
            tags: ["Usuários"],
            security: [{ jwtAuth: [] }],
            summary: "Adicionar/Atualizar Foto do Usuário",
            description: "Adiciona ou atualiza a foto de perfil de um usuário existente no sistema. A imagem é obrigatória e não pode ser enviada vazia.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>"+
             "<strong>Permissões necessárias:</strong> Administrador ou o próprio usuário (ao atualizar sua própria foto de perfil).",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário cuja foto será adicionada ou atualizada.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            required: ["file"],
                            properties: {
                                file: {
                                    type: "string",
                                    format: "binary",
                                    description: "Arquivo da imagem do usuário."
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, ""),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500]),
            }
        }
    },
    "/usuarios/{id}/image": {
        get: {
            tags: ["Usuários"],
            summary: "Obter Foto do Usuário",
            description: "Retorna a foto de perfil do usuário com o ID fornecido. Se o usuário não tiver uma foto cadastrada, será retornada uma resposta de erro.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário cuja foto será retornada.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Foto do usuário retornada com sucesso.",
                    content: {
                        "image/*": {
                            schema: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                },
                ...gerarRespostasDeErro([401, 403, 422, 498, 500]),
            }
        },
        delete: {
            tags: ["Usuários"],
            summary: "Deletar foto do Usuário",
            description: "Deleta a foto de perfil do usuário identificado pelo ID fornecido.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>"+
             "<strong>Permissões necessárias:</strong> Administrador ou o próprio usuário (ao deletar sua própria foto de perfil).",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário cuja foto será apagada.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200,[]),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500]),
            }
        }
    }
}
import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CursoPath = {
    "/cursos": {
        get: {
            tags: ["Cursos"],
            summary: "Listar Todos os Cursos",
            description: "Recupera uma lista de todos os cursos disponíveis no sistema.",
            parameters: [
                {
                    name: "filtro",
                    in: "query",
                    description: "Filtros para refinar os resultados da pesquisa. Permite filtrar por nome, descrição, categoria e instrutores.",
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
                ...gerarRespostasCorretas(200, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        },
        post: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Criar Novo Curso",
            description: "Cria um novo curso com as informações fornecidas.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CursoRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    },
    "/cursos/{id}": {
        get: {
            tags: ["Cursos"],
            summary: "Obter Curso por ID",
            description: "Recupera os detalhes de um curso específico identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso a ser recuperado.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
        delete: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Excluir Curso",
            description: "Remove um curso do sistema, identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso a ser excluído.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "", true),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    },
    "/cursos/informacoes/{cursoid}": {
        get: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Informações do Curso",
            description: "Recupera informações detalhadas de um curso específico com base no ID fornecido.",
            parameters: [
                {
                    name: "cursoid",
                    in: "path",
                    description: "ID único do curso",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid",
                        example: "123e4567-e89b-12d3-a456-426614174000"
                    }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/CursoInformacoesResponse"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/cursos/inscricoes/usuario/{usuarioid}": {
        get: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Cursos por ID do Usuário",
            description: "Recupera todos os cursos nos quais um usuário específico está inscrito, identificado pelo ID do usuário.",
            parameters: [
                {
                    name: "usuarioid",
                    in: "path",
                    description: "ID do usuário cujas inscrições devem ser recuperadas.",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Curso"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        },
    },
    "/cursos/{id}/capa/upload": {
        post: {
            tags: ["Cursos"],
            security: [{ jwtAuth: [] }],
            summary: "Adicionar/Atualizar capa do Curso",
            description: "Adiciona ou atualiza a capa de um curso existente no sistema. A imagem é obrigatória e não pode ser enviada vazia.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso cuja a capa será adicionada ou atualizada.",
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
                                    description: "Arquivo da imagem da capa do curso."
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
    "/cursos/{id}/capa": {
        get: {
            tags: ["Cursos"],
            summary: "Obter Capa do Curso",
            description: "Retorna a capa do curso com o ID fornecido. Se o curso não tiver uma capa cadastrada, será retornada uma resposta de erro.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do curso cuja a capa será retornada.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Capa do curso retornada com sucesso.",
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
        }
    }
}
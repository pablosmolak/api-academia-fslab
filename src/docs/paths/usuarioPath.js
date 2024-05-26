import messages from "../../utils/mensagens.js";

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
                200: {
                    description: messages.httpCodes[200],
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Usuario"
                                }
                            }
                        }
                    }
                },
                401: {
                    description: messages.httpCodes[401],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 401
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[401]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Permissão insuficiente para executar a operação!"]
                                    }
                                }
                            }
                        }
                    }
                },
                498: {
                    description: messages.httpCodes[498],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 498
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[498]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Token inválido!"]
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: messages.httpCodes[500],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 500
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[500]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["grupoId is not defined"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
                            $ref: "#/components/schemas/Usuario"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: messages.httpCodes[201],
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Usuario"
                            }
                        }
                    }
                },
                422: {
                    description: messages.httpCodes[422],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 422
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[422]
                                    },
                                    errors: {
                                        type: "string",
                                        example: [{
                                            "message": "O campo email informado já está cadastrado!",
                                            "path": "email"
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: messages.httpCodes[500],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 500
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[500]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["grupoId is not defined"]
                                    }
                                }
                            }
                        }
                    }
                }
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
                200: {
                    description: messages.httpCodes[200],
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Usuario"
                            }
                        }
                    }
                },
                401: {
                    description: messages.httpCodes[401],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 401
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[401]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Permissão insuficiente para executar a operação!"]
                                    }
                                }
                            }
                        }
                    }
                },
                422: {
                    description: messages.httpCodes[422],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 422
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[422]
                                    },
                                    errors: {
                                        type: "string",
                                        example: [{
                                            "message": "O ID informado deve estar em um formato válido (16 bytes)!",
                                            "path": "id"
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                498: {
                    description: messages.httpCodes[498],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 498
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[498]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Token inválido!"]
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: messages.httpCodes[500],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 500
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[500]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["grupoId is not defined"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
                            $ref: "#/components/schemas/Usuario"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: messages.httpCodes[200],
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Usuario"
                            }
                        }
                    }
                },
                401: {
                    description: messages.httpCodes[401],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 401
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[401]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Permissão insuficiente para executar a operação!"]
                                    }
                                }
                            }
                        }
                    }
                },
                422: {
                    description: messages.httpCodes[422],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 422
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[422]
                                    },
                                    errors: {
                                        type: "string",
                                        example: [{
                                            "message": "O ID informado deve estar em um formato válido (16 bytes)!",
                                            "path": "id"
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                498: {
                    description: messages.httpCodes[498],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 498
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[498]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Token inválido!"]
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: messages.httpCodes[500],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 500
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[500]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["grupoId is not defined"]
                                    }
                                }
                            }
                        }
                    }
                }
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
                200: {
                    description: messages.httpCodes[200],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: false
                                    },
                                    code: {
                                        type: "integer",
                                        example: 200
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[200]
                                    },
                                    errors: {
                                        type: "string",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: messages.httpCodes[401],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 401
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[401]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Permissão insuficiente para executar a operação!"]
                                    }
                                }
                            }
                        }
                    }
                },
                422: {
                    description: messages.httpCodes[422],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 422
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[422]
                                    },
                                    errors: {
                                        type: "string",
                                        example: [{
                                            "message": "O ID informado deve estar em um formato válido (16 bytes)!",
                                            "path": "id"
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                498: {
                    description: messages.httpCodes[498],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 498
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[498]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["Token inválido!"]
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: messages.httpCodes[500],
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "string",
                                        example: []
                                    },
                                    error: {
                                        type: "boolean",
                                        example: true
                                    },
                                    code: {
                                        type: "integer",
                                        example: 500
                                    },
                                    messages: {
                                        type: "string",
                                        example: messages.httpCodes[500]
                                    },
                                    errors: {
                                        type: "string",
                                        example: ["grupoId is not defined"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
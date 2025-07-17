export const CursoSchemas = {
    Curso: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID único do curso",
                example: "123e4567-e89b-12d3-a456-426614174000"
            },
            nome: {
                type: "string",
                description: "Nome do curso",
                example: "Introdução à Programação"
            },
            descricao: {
                type: "string",
                nullable: true,
                description: "Descrição detalhada do curso",
                example: `Este curso oferece uma introdução completa aos fundamentos da programação, abordando conceitos 
                essenciais como variáveis, estruturas de controle, funções e manipulação de dados. Ao final, você terá as habilidades 
                para escrever códigos básicos e resolver problemas simples.`
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do curso",
                example: "2024-07-26T12:34:56Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do curso",
                example: "2024-07-26T12:34:56Z"
            },
        },
        required: ["id", "nome", "created_at", "updated_at"],
        description: "Representação de um curso"
    },
    CursoRequestBody: {
        type: 'object',
        properties: {
            nome: {
                type: 'string',
                description: "Nome do curso",
                example: "Introdução à Programação"
            },
            descricao: {
                type: 'string',
                nullable: true,
                description: "Descrição do curso",
                example: "Este curso oferece uma introdução completa aos fundamentos da programação, abordando conceitos " +
                    "essenciais como variáveis, estruturas de controle, funções e manipulação de dados. Ao final, você terá as habilidades " +
                    "para escrever códigos básicos e resolver problemas simples."
            },
            categoria: {
                type: "array",
                items: {
                    type: "string",
                    format: "uuid",
                    description: "ID único da categoria",
                    example: "123e4567-e89b-12d3-a456-426614174000"
                },
                description: "Lista de IDs de categorias às quais o curso pertence"
            }
        },
        required: ['nome', 'descricao', 'categoria'],
        description: "Corpo da requisição para criar ou atualizar um curso"
    },
    CursoInformacoesResponse: {
        type: "object",
        properties: {
            nomeCurso: {
                type: "string",
                description: "Nome do curso",
                example: "Introdução à Programação"
            },
            descricao: {
                type: "string",
                description: "Descrição detalhada do curso",
                example: "Este curso fornece uma introdução aos fundamentos da programação."
            },
            topicos: {
                type: "array",
                items: {
                    type: "string",
                    description: "Tópicos abordados no curso",
                    example: "Introdução à Programação"
                },
                description: "Lista de tópicos abordados no curso"
            },
            instrutores: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        nome: {
                            type: "string",
                            description: "Nome do instrutor",
                            example: "Administrador"
                        },
                        fotoPerfil: {
                            type: ["string", "null"],
                            description: "URL da foto de perfil do instrutor, ou null se não disponível",
                            example: null
                        },
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "ID único do instrutor",
                            example: "bc18ae70-d147-4abe-94eb-0c000e0cfcd8"
                        }
                    },
                    required: ["nome", "id"],
                    description: "Informações de cada instrutor"
                },
                description: "Lista de instrutores do curso"
            },
            cargaHoraria: {
                type: "string",
                description: "Duração do curso",
                example: "1h30m"
            },
            quantidadeDeVideo: {
                type: "integer",
                description: "Quantidade total de vídeos no curso",
                example: 5
            },
            quantidadeAtividade: {
                type: "integer",
                description: "Quantidade de atividades no curso",
                example: 0
            }
        },
        required: [
            "nomeCurso",
            "descricao",
            "topicos",
            "instrutores",
            "cargaHoraria",
            "quantidadeDeVideo",
            "quantidadeAtividade"
        ],
        description: "Resposta com informações detalhadas de um curso"
    },
    CursoInstrutoresResponse: {
        type: 'object',
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID único do Instrutor",
                example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
            },
            nome: {
                type: "string",
                description: "Nome do instrutor",
                example: "Dev de Oliveira"
            },
            email: {
                type: "string",
                format: "email",
                description: "Email do instrutor",
                example: "dev@gmail.com"
            },
            fotoPerfil: {
                type: "string",
                nullable: true,
                description: "URL da foto de perfil do instrutor",
                example: null
            },
        },
        required: ['id', 'nome', 'email', 'fotoPerfil'],
        description: "Resposta dos instrutores de um curso"
    },
    CursoInstrutoresRequestBody: {
        type: 'object',
        properties: {
            usersID: {
                type: "array",
                items: {
                    type: "string",
                    format: "uuid",
                    description: "ID único do Instrutor",
                    example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
                }
            }
        },
        required: ['usersID'],
        description: "Corpo da requisição para adicionar instrutores a um curso"
    },
    CursoInstrutoresRemoveBody: {
        type: 'object',
        properties: {
            usersID: {
                type: "array",
                items: {
                    type: "string",
                    format: "uuid",
                    description: "ID único do Instrutor",
                    example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
                }
            }
        },
        required: ['usersID'],
        description: "Corpo da requisição para remover instrutores do curso"
    },
    CursoInstrutoresResponseBody: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID único da relação entre instrutor e curso",
                example: "4eaab49e-b0a8-46fe-a224-7edefb336981"
            },
            cursoId: {
                type: "string",
                format: "uuid",
                description: "ID do curso associado",
                example: "1450b645-b14f-4445-a607-48e04400647c"
            },
            userId: {
                type: "string",
                format: "uuid",
                description: "ID do usuário (instrutor) associado",
                example: "0eff7420-9757-4ac4-937a-6a9db7b45a20"
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do curso",
                example: "2024-07-26T12:34:56Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do curso",
                example: "2024-07-26T12:34:56Z"
            },
        },
        required: ["id", "cursoId", "userId", "created_at", "updated_at"],
        description: "Resposta da relação entre instrutor e curso"
    }
}
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
                example: "Este curso fornece uma introdução aos fundamentos da programação."
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
                example: "Este curso fornece uma introdução aos fundamentos da programação."
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
    }
}

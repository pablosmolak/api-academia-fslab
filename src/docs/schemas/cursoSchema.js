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
    }
}

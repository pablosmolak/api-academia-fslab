export const CategoriaSchemas = {
    Categoria: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID único da categoria",
                example: "123e4567-e89b-12d3-a456-426614174000"
            },
            nome: {
                type: "string",
                description: "Nome da categoria",
                example: "Tecnologia"
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação da categoria",
                example: "2024-07-26T12:34:56Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização da categoria",
                example: "2024-07-26T12:34:56Z"
            }
        },
        required: ["id", "nome", "created_at", "updated_at"],
        description: "Representação de uma categoria"
    },
    CategoriaRequestBody: {
        type: 'object',
        properties: {
            nome: { 
                type: 'string',
                description: "Nome da categoria",
                example: "Tecnologia"
            }
        },
        required: ['nome'],
        description: "Corpo da requisição para criar ou atualizar uma categoria"
    }
}

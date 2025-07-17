export const TopicoSchemas = {
    Topico: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID único do tópico",
                example: "123e4567-e89b-12d3-a456-426614174000"
            },
            titulo: {
                type: "string",
                description: "Título do tópico",
                example: "Introdução à Programação"
            },
            ordem: {
                type: "integer",
                description: "Ordem do tópico dentro do curso",
                example: 1
            },
            cursoId: {
                type: "string",
                format: "uuid",
                description: "ID do curso ao qual o tópico pertence",
                example: "789e4567-e89b-12d3-a456-426614174000"
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do tópico",
                example: "2024-07-26T12:34:56Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do tópico",
                example: "2024-07-26T12:34:56Z"
            },
        },
        required: ["id", "titulo", "ordem", "cursoId", "created_at", "updated_at"],
        description: "Representação de um tópico dentro de um curso"
    },
    TopicoRequestBody: {
        type: 'object',
        properties: {
            titulo: { 
                type: 'string', 
                description: "Título do tópico",
                example: "Introdução à Programação"
            },
            cursoId: {
                type: "string",
                format: "uuid",
                description: "ID do curso ao qual o tópico pertence",
                example: "789e4567-e89b-12d3-a456-426614174000"
            }
        },
        required: ['titulo', 'cursoId'],
        description: "Corpo da requisição para criar ou atualizar um tópico"
    },
    TopicoUpdateRequestBody: {
        type: 'object',
        properties: {
            titulo: { 
                type: 'string', 
                description: "Título do tópico",
                example: "Introdução à Programação"
            },
            ordem: {
                type: "integer",
                description: "Ordem do tópico dentro do curso",
                example: 1
            },
        },
        required: ['titulo', 'ordem'],
        description: "Corpo da requisição para criar ou atualizar um tópico"
    }
}

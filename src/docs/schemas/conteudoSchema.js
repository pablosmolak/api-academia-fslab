export const ConteudoCursoSchemas = {
    Conteudo: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID único do conteúdo",
                example: "123e4567-e89b-12d3-a456-426614174000"
            },
            topicoId: {
                type: "string",
                format: "uuid",
                description: "ID do tópico ao qual o conteúdo pertence",
                example: "789e4567-e89b-12d3-a456-426614174000"
            },
            tipo: {
                type: "string",
                description: "Tipo de conteúdo (Youtube URL)",
                example: "Youtube URL"
            },
            conteudo: {
                type: "string",
                description: "Conteúdo em si (Youtube URL)",
                example: "https://youtu.be/dQw4w9WgXcQ"
            },
            ordem: {
                type: "integer",
                description: "Ordem do conteúdo dentro do tópico",
                example: 1
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do conteúdo",
                example: "2024-07-26T12:34:56Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do conteúdo",
                example: "2024-07-26T12:34:56Z"
            },
        },
        required: ["id", "topicoId", "tipo", "conteudo", "ordem", "created_at", "updated_at"],
        description: "Representação de um conteúdo dentro de um curso"
    },
    ConteudoRequestBody: {
        type: 'object',
        properties: {
            topicoId: {
                type: "string",
                format: "uuid",
                description: "ID do tópico ao qual o conteúdo pertence",
                example: "789e4567-e89b-12d3-a456-426614174000"
            },
            tipo: { 
                type: 'string', 
                description: "Tipo de conteúdo (Youtube URL)",
                example: "Youtube URL"
            },
            conteudo: { 
                type: 'string', 
                description: "Conteúdo em si (Youtube URL)",
                example: "https://youtu.be/dQw4w9WgXcQ"
            },
        },
        required: ['topicoId', 'tipo', 'conteudo'],
        description: "Corpo da requisição para criar ou atualizar um conteúdo"
    }
}

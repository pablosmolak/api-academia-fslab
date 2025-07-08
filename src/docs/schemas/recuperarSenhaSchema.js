export const TopicoSchemas = {
    Recuperar: {
        type: "object",
        properties: {
            message: {
                type: "string",
                description: "Solicitação de alteração de senha enviada com sucesso!",
                example: "Um e-mail com instruções foi enviado para o endereço fornecido."
            }
        },
        required: ["message", "titulo", "ordem", "cursoId", "created_at", "updated_at"],
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
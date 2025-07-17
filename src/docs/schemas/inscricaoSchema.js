export const InscricaoSchemas = {
    Inscricao: {
        type: "object",
        properties: {
            cursoId: {
                type: "string",
                description: "ID do curso ao qual a inscrição está associada",
                example: "c1a4f56e-9b8a-4d4e-812e-6c2c2e3d1234"
            },
            userId: {
                type: "string",
                description: "ID do usuário que fez a inscrição",
                example: "u9d8f7a6e-4b5a-4c2b-8c1f-7e9d8f6a1b23"
            },
            status: {
                type: "string",
                description: "Status da inscrição",
                example: "Em Andamento",
                default: "Em Andamento"
            },
            dataInscricao: {
                type: "string",
                format: "date-time",
                description: "Data em que a inscrição foi realizada",
                example: "2024-07-30T08:30:00Z"
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do registro de inscrição",
                example: "2024-07-30T08:30:00Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do registro de inscrição",
                example: "2024-07-30T08:30:00Z"
            }
        },
        required: ["cursoId", "userId", "status", "dataInscricao", "created_at", "updated_at"],
        description: "Representação de uma inscrição"
    },
    InscricaoRequestBody: {
        type: 'object',
        properties: {
            cursoId: {
                type: 'string',
                description: "ID do curso ao qual a inscrição está associada",
                example: "c1a4f56e-9b8a-4d4e-812e-6c2c2e3d1234"
            }
        },
        required: ['cursoId'],
        description: "Corpo da requisição para criar ou atualizar uma inscrição"
    }
}

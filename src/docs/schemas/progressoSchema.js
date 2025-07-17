export const ProgressoSchemas = {
    ProgressoCurso: {
        type: "object",
        properties: {
            userId: {
                type: "string",
                description: "ID do usuário associado ao progresso do curso",
                example: "u9d8f7a6e-4b5a-4c2b-8c1f-7e9d8f6a1b23"
            },
            cursoId: {
                type: "string",
                description: "ID do curso associado ao progresso do usuário",
                example: "c1a4f56e-9b8a-4d4e-812e-6c2c2e3d1234"
            },
            porcentagem: {
                type: "number",
                description: "Porcentagem de conclusão do curso",
                example: 75.5
            },
            atividadeAtual: {
                type: "string",
                description: "ID da atividade atual em progresso",
                example: "a5c7e4d3-8f2b-4a6d-9b2e-1d3e5f7c9b4e"
            },
            atividadesConcluidas: {
                type: "array",
                items: { type: "string" },
                description: "IDs das atividades concluídas",
                example: ["a5c7e4d3-8f2b-4a6d-9b2e-1d3e5f7c9b4e", "b6d8f7c1-9e3b-4d1a-8c6e-2f4d9b7c5a1e"]
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do registro de progresso",
                example: "2024-07-30T08:30:00Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do registro de progresso",
                example: "2024-07-30T08:30:00Z"
            }
        },
        required: ["userId", "cursoId", "porcentagem", "created_at", "updated_at"],
        description: "Representação do progresso de um usuário em um curso"
    }
}

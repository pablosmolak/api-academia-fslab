export const CertificadoSchemas = {
    Certificado: {
        type: "object",
        properties: {
            userId: {
                type: "string",
                description: "ID do usuário que recebeu o certificado",
                example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
            },
            cursoId: {
                type: "string",
                description: "ID do curso para o qual o certificado foi emitido",
                example: "6fa4d577-e3a1-4d44-b7b4-13fe8fbbb63a"
            },
            validador: {
                type: "string",
                description: "Código único para validação do certificado",
                example: "01e3771f-49d4-4eee-9289-a8351d790a9e",
                uniqueItems: true
            },
            created_at: {
                type: "string",
                format: "date-time",
                description: "Data de emissão do certificado",
                example: "2024-07-29T21:11:15.957Z"
            },
            updated_at: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização do certificado",
                example: "2024-07-29T21:11:15.957Z"
            },
            usuario: {
                type: "object",
                description: "Informações do usuário que recebeu o certificado",
                properties: {
                    id: {
                        type: "string",
                        description: "ID do usuário",
                        example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
                    },
                    nome: {
                        type: "string",
                        description: "Nome do usuário",
                        example: "Dev de Oliveira"
                    },
                    email: {
                        type: "string",
                        description: "Email do usuário",
                        example: "dev@gmail.com"
                    }
                },
                required: ["id", "nome", "email"]
            },
            curso: {
                type: "object",
                description: "Informações do curso para o qual o certificado foi emitido",
                properties: {
                    id: {
                        type: "string",
                        description: "ID do curso",
                        example: "6fa4d577-e3a1-4d44-b7b4-13fe8fbbb63a"
                    },
                    nome: {
                        type: "string",
                        description: "Nome do curso",
                        example: "Introdução à Programação"
                    },
                    descricao: {
                        type: "string",
                        description: "Descrição do curso",
                        example: "Este curso fornece uma introdução aos fundamentos da programação."
                    }
                },
                required: ["id", "nome", "descricao"]
            }
        },
        required: ["userId", "cursoId", "validador", "created_at", "updated_at", "usuario", "curso"],
        description: "Representação de um certificado emitido para um usuário"
    }
}

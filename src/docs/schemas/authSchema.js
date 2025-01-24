export const AuthSchemas = {
    Login: {
        type: "object",
        properties: {
            token: {
                type: "string",
                description: "Token JWT para autenticação",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGU3ODBlMWRmZWZiMWUyN2ViMmQ5MSIsIm5vbWUiOiJEZXYgT2xpdmVpcmEiLCJlbWFpbCI6ImRldkBnbWFpbC5jb20iLCJhdGl2byI6dHJ1ZSwiaWF0IjoxNzA5NTk4OTExLCJleHAiOjE3MTA4OTQ5MTF9.KvhEcRDZ37XZsv9J9FcqEGFlDYvC_imuT32PulE3sbA"
            },
            payload: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        description: "ID único do usuário",
                        example: "123e4567-e89b-12d3-a456-426614174000"
                    },
                    name: {
                        type: "string",
                        description: "Nome do usuário",
                        example: "Dev Oliveira"
                    },
                    email: {
                        type: "string",
                        description: "Endereço de email do usuário",
                        example: ""
                    },
                    ativo: {
                        type: "boolean",
                        description: "Status de ativação do usuário",
                        example: true
                    },
                    grupo: {
                        type: "string",
                        description: "Nome do grupo do usuário",
                        example: "Administradores"
                    },
                    emailVerificado: {
                        type: "boolean",
                        description: "Status de verificação do email do usuário",
                        example: true
                    },
                    iat: {
                        type: "number",
                        description: "Data de criação do token",
                        example: 1709598911
                    },
                    exp: {
                        type: "number",
                        description: "Data de expiração do token",
                        example: 1710894911
                    }
                }
            }

        },
        required: ["token", "payload"],
        description: "Resposta da requisição de autenticação"
    },
    Check: {
        type: 'object',
        properties: {
            payload: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        description: "ID único do usuário",
                        example: "123e4567-e89b-12d3-a456-426614174000"
                    },
                    name: {
                        type: "string",
                        description: "Nome do usuário",
                        example: "Dev Oliveira"
                    },
                    email: {
                        type: "string",
                        description: "Endereço de email do usuário",
                        example: ""
                    },
                    ativo: {
                        type: "boolean",
                        description: "Status de ativação do usuário",
                        example: true
                    },
                    grupo: {
                        type: "string",
                        description: "Nome do grupo do usuário",
                        example: "Administradores"
                    },
                    emailVerificado: {
                        type: "boolean",
                        description: "Status de verificação do email do usuário",
                        example: true
                    },
                    iat: {
                        type: "number",
                        description: "Data de criação do token",
                        example: 1709598911
                    },
                    exp: {
                        type: "number",
                        description: "Data de expiração do token",
                        example: 1710894911
                    }
                }
            }
        },
        required: ["payload"],
        description: "Resposta da requisição de verificação de token"
    }
}

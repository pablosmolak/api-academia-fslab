import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const RecuperaSenhaPath = {
    "/recuperasenha": {
        post: {
            tags: ["Recuperar Senha"],
            summary: "Solicitar Recuperação de Senha",
            description: "Permite que um usuário inicie o processo de recuperação de senha. O usuário deve fornecer seu endereço de e-mail registrado para receber um link com instruções para redefinir sua senha.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "O endereço de e-mail registrado do usuário",
                                    example: "usuario@example.com"
                                }
                            },
                            required: ["email"]
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensagem de confirmação de solicitação de recuperação de senha",
                            example: "Um e-mail com instruções foi enviado para o endereço fornecido."
                        }
                    }
                }),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    },
    "/alterarsenha": {
        post: {
            tags: ["Recuperar Senha"],
            summary: "Redefinir Senha",
            description: "Permite que o usuário redefina sua senha usando um token de recuperação enviado por e-mail. O usuário deve fornecer o token e a nova senha desejada.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                token: {
                                    type: "string",
                                    description: "Token de recuperação de senha",
                                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                },
                                novaSenha: {
                                    type: "string",
                                    description: "Nova senha desejada",
                                    example: "NovaSenha@123"
                                }
                            },
                            required: ["token", "novaSenha"]
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensagem de confirmação de alteração de senha",
                            example: "Sua senha foi alterada com sucesso."
                        }
                    }
                }),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    }
}

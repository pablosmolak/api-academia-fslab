import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const RecuperaSenhaPath = {
    "/recuperarsenha": {
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
                                },
                                urlFront: {
                                    type: "string",
                                    description: "A URL da página de recuperação de senha",
                                    example: "https://academia.app.fslab.dev/alterasenha"
                                }

                            },
                            required: ["email", "urlFront"]
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, {
                   
                }),
                ...gerarRespostasDeErro([400, 422, 500])
            }
        }
    },
    "/alterarsenha": {
        post: {
            tags: ["Recuperar Senha"],
            summary: "Redefinir Senha",
            description: "Permite que o usuário redefina sua senha usando um token de recuperação enviado por e-mail. O usuário deve fornecer o token e a nova senha desejada.",
            parameters: [
                {
                    name: "token",
                    in: "query",
                    description: "Token de recuperação de senha enviado ao usuário.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "email",
                    in: "query",
                    description: "Email do usuário que pediu a recuperação de senha.",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                senha: {
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
                ...gerarRespostasDeErro([400, 422, 500])
            }
        }
    }
}

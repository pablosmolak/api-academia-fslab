import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const AuthPath = {
    "/login": {
        post: {
            tags: ["Login"],
            summary: "Autenticação de Usuário",
            description: "Autentica o usuário na API usando email e senha. Se as credenciais forem válidas, um token JWT é retornado, permitindo acesso autenticado aos recursos protegidos.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "Endereço de email do usuário",
                                    example: "dev@gmail.com"
                                },
                                senha: {
                                    type: "string",
                                    description: "Senha do usuário",
                                    example: "Dev@1234"
                                }
                            },
                            required: ["email", "senha"]
                        }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Login"),
                ...gerarRespostasDeErro([400, 422, 500])
            }
        }
    },
    "/login/check": {
        get: {
            tags: ["Login"],
            summary: "Retorna o payload do token do usuario.",
            description: "Retorna o payload atualizado do token do usuario logado.",
            security: [{ jwtAuth: [] }],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Check"),
                ...gerarRespostasDeErro([400, 422, 500])
            }
        }
    }
}

import { gerarRespostasDeErro } from "../communs.js";

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
                200: {
                    description: "Autenticação bem-sucedida. Retorna um token JWT para acesso a recursos protegidos.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    token: {
                                        type: "string",
                                        description: "Token JWT para autenticação",
                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGU3ODBlMWRmZWZiMWUyN2ViMmQ5MSIsIm5vbWUiOiJEZXYgT2xpdmVpcmEiLCJlbWFpbCI6ImRldkBnbWFpbC5jb20iLCJhdGl2byI6dHJ1ZSwiaWF0IjoxNzA5NTk4OTExLCJleHAiOjE3MTA4OTQ5MTF9.KvhEcRDZ37XZsv9J9FcqEGFlDYvC_imuT32PulE3sbA"
                                    }
                                }
                            }
                        }
                    }
                },
                ...gerarRespostasDeErro([422, 500])
            }
        }
    }
}

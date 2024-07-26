import { gerarRespostasDeErro } from "../communs.js";

export const AuthPath = {
    "/login": {
        post: {
            tags: ["Login"],
            summary: "Login de usuário",
            description: "Autentica o usuário na API utilizando email e senha. Retorna um token JWT para acesso autenticado aos recursos protegidos.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "O endereço de email do usuário",
                                    example: "dev@gmail.com"
                                },
                                senha: {
                                    type: "string",
                                    description: "A senha do usuário",
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
                    description: "Login efetuado com sucesso. Retorna um token JWT para acesso autenticado.",
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

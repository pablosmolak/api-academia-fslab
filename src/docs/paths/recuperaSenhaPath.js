import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const RecuperaSenhaPath = {
    "/recuperasenha": {
        post: {
            tags: ["Recuperar Senha"],
            summary: "Solicitar recuperação de senha",
            description: "Envia uma solicitação para iniciar o processo de recuperação de senha. O usuário deve fornecer seu endereço de e-mail cadastrado para receber instruções sobre como redefinir sua senha.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CategoriaRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        },
    },
    "/alterarsenha": {
        post: {
            tags: ["Recuperar Senha"],
            summary: "Alterar senha",
            description: "Permite ao usuário alterar sua senha utilizando um token de recuperação recebido via e-mail. O usuário deve fornecer o token e a nova senha desejada.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CategoriaRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(201, "#/components/schemas/Categoria"),
                ...gerarRespostasDeErro([401, 422, 498, 500])
            }
        }
    }
}

import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";
export const VerificarEmailPath = {
    "/verificaremail": {
        post: {
            tags: ["Verificação de Email"],
            security: [{ jwtAuth: [] }],
            summary: "Verificar Código de E-mail",
            description: "Verifica se o código de verificação fornecido é válido para o e-mail.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/VerificarEmailRequestBody" }
                    }
                }
            },
            responses: {
                ...gerarRespostasCorretas(200, ""),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    },
    "/verificaremail/enviarcodigo": {
        post: {
            tags: ["Verificação de Email"],
            security: [{ jwtAuth: [] }],
            summary: "Enviar Código de Verificação para E-mail",
            description: "Envia um código de verificação para o e-mail fornecido para permitir a verificação do usuário.",
            responses: {
                ...gerarRespostasCorretas(200,""),
                ...gerarRespostasDeErro([400, 401, 403, 422, 498, 500])
            }
        }
    }
};
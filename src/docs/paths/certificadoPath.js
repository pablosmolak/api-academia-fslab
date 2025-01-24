import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CertificadoPath = {
    "/certificados": {
        get: {
            tags: ["Certificados"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todos os Certificados",
            description: "Recupera uma lista de todos os certificados emitidos no sistema.",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Certificado"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/certificados/usuario/{usuarioid}": {
        get: {
            tags: ["Certificados"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Certificados de um Usuário",
            description: "Recupera uma lista de todos os certificados emitidos para um usuário específico, identificado pelo ID fornecido.",
            parameters: [
                {
                    name: "usuarioid",
                    in: "path",
                    description: "ID do usuário cujos certificados devem ser recuperados",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Certificado"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/certificados/usuario/curso/{cursoId}": {
        get: {
            tags: ["Certificados"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Certificados do usuário logado no curso",
            description: "Recupera o certificado emitido para o usuário logado em um curso específico.",
            parameters: [
                {
                    name: "cursoId",
                    in: "path",
                    description: "ID do curso cujos certificado devem ser recuperado",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Certificado"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/certificados/validar/{validador}": {
        get: {
            tags: ["Certificados"],
            security: [{ jwtAuth: [] }],
            summary: "Verificar a validade do Certificado",
            description: "Verifica a validade de um certificado específico utilizando o código único de validador fornecido.",
            parameters: [
                {
                    name: "validador",
                    in: "path",
                    description: "Código único de validação do certificado",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Certificado"),
                ...gerarRespostasDeErro([401, 403, 422, 498, 500])
            }
        }
    }
};

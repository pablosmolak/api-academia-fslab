import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const CertificadoPath = {
    "/certificados": {
        get: {
            tags: ["Certificados"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Todos os Certificados",
           description: "Recupera uma lista de todos os certificados emitidos no sistema.<br>" +
             "Se o usuário for um Administrador, ele pode visualizar todos os certificados.<br>" +
             "Se o usuário for um Ministrante (Professor), ele só pode visualizar certificados dos cursos que criou ou nos quais é instrutor.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
             "<strong>Permissões necessárias:</strong> Administrador ou Ministrante.",
            parameters: [
                {
                    name: "cursoId",
                    in: "query",
                    description: "Filtra a inscrição pelo id do curso.",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "usuarioId",
                    in: "query",
                    description: "Filtra a inscrição pelo id do usuário inscrito.",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "pagina",
                    in: "query",
                    description: "Número da página de resultados da pesquisa",
                    required: false,
                    schema: {
                        type: "integer",
                        default: 1,
                        minimum: 1
                    }
                },
                {
                    name: "limite",
                    in: "query",
                    description: "Quantidade máxima de resultados por página",
                    required: false,
                    schema: {
                        type: "integer",
                        default: 10,
                        minimum: 1,
                        maximum: 100
                    }
                }
            ],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Certificado"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            }
        }
    },
    "/certificados/usuario": {
        get: {
            tags: ["Certificados"],
            security: [{ jwtAuth: [] }],
            summary: "Listar Certificados do Usuário logado",
            description: "Recupera uma lista de todos os certificados emitidos para um usuário específico, identificado pelo ID fornecido.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
            parameters: [],
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
            description: "Recupera o certificado emitido para o usuário logado em um curso específico.<br><br>" +
             "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.",
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

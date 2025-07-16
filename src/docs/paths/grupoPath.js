import { gerarRespostasCorretas, gerarRespostasDeErro } from "../communs.js";

export const GrupoPath = {
    "/grupos": {
        get: {
            tags: ["Grupos"],
            security: [{ jwtAuth: [] }],
            summary: "Obter Lista de Grupos",
            description: "Recupera uma lista de todos os grupos disponíveis no sistema.<br>" +
                "O endpoint permite a visualização de grupos para fins de gerenciamento de permissões.<br><br>" +
                "<strong>Requisitos obrigatórios:</strong> O e-mail do usuário deve estar verificado.<br>" +
                "<strong>Permissões necessárias:</strong> Administrador.",
            parameters: [],
            responses: {
                ...gerarRespostasCorretas(200, "#/components/schemas/Grupo"),
                ...gerarRespostasDeErro([401, 403, 498, 500])
            },
        },
    },
}

export const usuarioSchema = {
	Usuario: {
		type: "object",
		properties: {
			nome: {
				type: "string",
				description: "Nome do usuário",
				example: "João da Silva"
			},
			email: {
				type: "string",
				description: "E-mail do usuário",
				example: "joao@example.com"
			},
			senha: {
				type: "string",
				description: "Senha do usuário",
				example: "Senha123@"
			}
		}
	}
};

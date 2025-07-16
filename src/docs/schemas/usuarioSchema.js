export const UsuarioSchemas = {
	Usuario: {
		type: "object",
		properties: {
			id: {
				type: "string",
				format: "uuid",
				description: "ID único do usuário",
				example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
			},
			nome: {
				type: "string",
				description: "Nome do usuário",
				example: "Dev de Oliveira"
			},
			email: {
				type: "string",
				format: "email",
				description: "Email do usuário",
				example: "dev@gmail.com"
			},
			senha: {
				type: "string",
				description: "Senha do usuário",
				example: "Dev@1234"
			},
			tokenRecuperaSenha: {
				type: "string",
				nullable: true,
				description: "Token para recuperação de senha",
				example: null
			},
			fotoPerfil: {
				type: "string",
				nullable: true,
				description: "URL da foto de perfil do usuário",
				example: null
			},
			ativo: {
				type: "boolean",
				description: "Indica se o usuário está ativo"
			},
			grupoId: {
				type: "string",
				nullable: true,
				description: "ID do grupo ao qual o usuário pertence",
				example: "68841071-7e72-4c5c-87ac-cdc6f9613226"
			},
			created_at: {
				type: "string",
				format: "date-time",
				description: "Data de criação do usuário"
			},
			updated_at: {
				type: "string",
				format: "date-time",
				description: "Data da última atualização do usuário"
			}
		},
		required: ["id", "nome", "email", "senha", "ativo", "created_at", "updated_at"],
		description: "Representação de um usuário"
	},
	UsuarioRequestBody: {
		type: "object",
		properties: {
			nome: {
				type: "string",
				description: "Nome do usuário",
				example: "Dev de Oliveira"
			},
			email: {
				type: "string",
				format: "email",
				description: "Email do usuário",
				example: "dev@gmail.com"
			},
			senha: {
				type: "string",
				description: "Senha do usuário",
				example: "Dev@1234"
			}
		},
		required: ["nome", "email", "senha"],
		description: "Corpo da requisição para criação ou atualização de um usuário"
	},
	UsuarioAlterarGrupoRequestBody: {
		type: "object",
		properties: {
			grupoId: {
				type: "string",
				description: "ID do grupo",
				example: "9b1f5673-33de-4e2b-8e7d-a78c79792689"
			}
		},
		required: ["grupoId"],
		description: "Corpo da requisição para atualização do grupo de um usuário"
	}
}
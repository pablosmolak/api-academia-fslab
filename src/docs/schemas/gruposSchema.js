export const GrupoSchemas = {
	Grupo: {
		type: "object",
		properties: {
			id: {
				type: "string",
				format: "uuid",
				description: "ID único do grupo",
				example: "2d40c652-dfa6-470b-8913-6002d8b2d76f"
			},
			nome: {
				type: "string",
				description: "Nome do grupo",
				example: "Cursantes"
			},
			created_at: {
				type: "string",
				format: "date-time",
				description: "Data de criação do grupo"
			},
			updated_at: {
				type: "string",
				format: "date-time",
				description: "Data da última atualização do grupo"
			}
		},
		required: ["id", "nome", "created_at", "updated_at"],
		description: "Representação de um curso"
	}
}
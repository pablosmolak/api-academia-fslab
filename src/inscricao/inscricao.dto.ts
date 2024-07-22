export class InscricaoDTO {
    cursoId: string
    userId: string
    status?: string
    dataInscricao: Date
    created_at: Date
    updated_at: Date
}

export class FiltersInscricaoDTO {
    cursoId: string;
    usuarioId: string;
};
export class UsuariosDTO {
    id: string;
    nome: string;
    email: string;
    senha: string;
    tokenRecuperaSenha?: string;
    fotoPerfil?: string;
    grupoid?: string;
    ativo: boolean;
    created_at: Date;
    updated_at: Date;
};

export class FiltersUsuarioDTO {
    nome: string;
    email: string;
};
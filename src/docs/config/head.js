import { AuthPath } from "../paths/authPath.js";
import { CategoriaPath } from "../paths/categoriaPath.js";
import { CategoriaSchemas } from "../schemas/categoriaSchema.js";
import { UsuarioPath } from "../paths/usuarioPath.js";
import { UsuarioSchemas } from "../schemas/usuarioSchema.js";
import { CursoSchemas } from "../schemas/cursoSchema.js";
import { CursoPath } from "../paths/cursoPath.js";
import { TopicoSchemas } from "../schemas/topicoSchema.js";
import { ConteudoCursoSchemas } from "../schemas/conteudoSchema.js";
import { TopicoPath } from "../paths/topicoPath.js";
import { RecuperaSenhaPath } from "../paths/recuperaSenhaPath.js";
import { ConteudoPath } from "../paths/conteudoPath.js";
import { InscricaoSchemas } from "../schemas/inscricaoSchema.js";
import { InscricaoPath } from "../paths/inscricaoPath.js";
import { ProgressoPath } from "../paths/progressoPath.js";
import { ProgressoSchemas } from "../schemas/progressoSchema.js";
import { CertificadoSchemas } from "../schemas/certificadoSchema.js";
import { CertificadoPath } from "../paths/certificadoPath.js";
import { VerificarEmailSchemas } from "../schemas/verificarEmailSchema.js";
import { VerificarEmailPath } from "../paths/verificarEmailPath.js";
import { AuthSchemas } from "../schemas/authSchema.js";
import { RecuperarSenhaSchema } from "../schemas/recuperarSenhaSchema.js";
import { GrupoPath } from "../paths/grupoPath.js";
import { GrupoSchemas } from "../schemas/gruposSchema.js";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API - Academia FSlab",
      description:
        "A api foi desenvolvida para a plataforma de curso Academia FSlab.",
      version: "0.0.1",
      license: {
        name: "GPLv3",
        url: "http://www.gnu.org/licenses/gpl-3.0.html",
      },
    },
    externalDocs: {
      description: "Documentação detalhada",
      url: "",
    },
    servers: [
      {
        url: `https://api-academia.app.fslab.dev/`,
        description: "API em produção",
      },
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "API em desenvolvimento",
      }
    ],
    components: {
      securitySchemes: {
        jwtAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
      schemas: {
        ...UsuarioSchemas,
        ...GrupoSchemas,
        ...CategoriaSchemas,
        ...CursoSchemas,
        ...TopicoSchemas,
        ...ConteudoCursoSchemas,
        ...InscricaoSchemas,
        ...ProgressoSchemas,
        ...CertificadoSchemas,
        ...VerificarEmailSchemas,
        ...AuthSchemas,
        ...RecuperarSenhaSchema
      },
    },
    tags: [
      {
        name: "Login",
        description: "Autenticação do usuário no sistema"
      },
      {
        name: "Recuperar Senha",
        description: "Processo de recuperação de senha do usuário"
      },
      {
        name: "Verificação de Email",
        description: "Processo de verificação do e-mail do usuário"
      },
      {
        name: "Usuários",
        description: "Gerenciamento de usuários do sistema"
      },
      {
        name: "Grupos",
        description: "Gerenciamento de grupos do sistema"
      },
      {
        name: "Categorias",
        description: "Gerenciamento das categorias de cursos"
      },
      {
        name: "Cursos",
        description: "Gerenciamento e informações sobre os cursos"
      },
      {
        name: "Tópicos",
        description: "Gerenciamento e informações sobre os tópicos dos cursos"
      },
      {
        name: "Conteúdos",
        description: "Gerenciamento e informações sobre os conteúdo dos tópicos dos cursos"
      },
      {
        name: "Inscrições",
        description: "Gerenciamento das inscrições nos cursos"
      },
      {
        name: "Progressos",
        description: "Gerenciamento do progresso dos estudantes nos cursos"
      },
      {
        name: "Certificados",
        description: "Gerenciamento do certificado dos estudantes nos cursos"
      }
    ],
    paths: {
      ...AuthPath,
      ...UsuarioPath,
      ...GrupoPath,
      ...CategoriaPath,
      ...CursoPath,
      ...TopicoPath,
      ...RecuperaSenhaPath,
      ...ConteudoPath,
      ...InscricaoPath,
      ...ProgressoPath,
      ...CertificadoPath,
      ...VerificarEmailPath
    },
  },
  apis: ["./src/routes/*.js"],
}

export default swaggerOptions;
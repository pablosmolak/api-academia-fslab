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
        url: `http://localhost:${process.env.PORT}`,
        description: "API em desenvolvimento",
      }
    ],
    components: {
      securitySchemes: {
        jwtAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...UsuarioSchemas,
        ...CategoriaSchemas,
        ...CursoSchemas,
        ...TopicoSchemas,
        ...ConteudoCursoSchemas
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
        name: "Usuários",
        description: "Gerenciamento de usuários do sistema"
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
        name: "Inscrições",
        description: "Gerenciamento das inscrições nos cursos"
      }
    ],
    paths: {
      ...AuthPath,
      ...UsuarioPath,
      ...CategoriaPath,
      ...CursoPath,
      ...TopicoPath,
      ...RecuperaSenhaPath
    },
  },
  apis: ["./src/routes/*.js"],
}

export default swaggerOptions;
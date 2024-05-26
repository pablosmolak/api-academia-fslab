import { AuthPath } from "../paths/authPath.js";
import { UsuarioPath } from "../paths/usuarioPath.js";
import { usuarioSchema } from "../schemas/usuarioSchema.js";

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
        ...usuarioSchema
      },
    },
    security: [
      {
        jwtAuth: [],
      },
    ],
    tags: [
      {
        name: "Login",
        description: "Login do usuário",
      },
      {
        name: "Recuperar senha",
        description: "Recuperação de senha",
      },
      {
        name: "Usuários",
        description: "Usuários do sistema",
      }
    ],
    paths: {
      ...AuthPath,
      ...UsuarioPath
    },
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerOptions;
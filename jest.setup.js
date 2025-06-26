import bcrypt from "bcryptjs/dist/bcrypt.js";
import { verificarAdministradorPadrao, verificarGrupos, verificarMinio } from "./src/config/initialConfig.js";
import { prisma } from "./src/config/prismaClient.js";
import { gruposEnum } from "./src/utils/enums.js";

beforeAll(async () => {
    try {
        await prisma.$connect()

        await verificarGrupos()
        await verificarMinio()
        await verificarAdministradorPadrao()

        const grupo = await prisma.grupo.findFirst({
            where: {
                nome: { in: [gruposEnum.Professores] },
            },
            select: { id: true },
        });

        await prisma.usuario.create({
            data: {
                nome: 'Professor',
                email: 'professor@gmail.com',
                senha: bcrypt.hashSync('Dev@1234',10),
                grupoId: grupo.id,
                ativo: true,
                emailVerificado: true
            }
        })

    } catch (error) {
        console.error('Erro no setup do banco:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await prisma.certificado.deleteMany();
        await prisma.progressoCurso.deleteMany();
        await prisma.inscricao.deleteMany();
        await prisma.conteudoCurso.deleteMany();
        await prisma.topico.deleteMany();
        await prisma.instrutores.deleteMany();
        await prisma.curso.deleteMany();
        await prisma.categoria.deleteMany();
        await prisma.usuario.deleteMany();
        await prisma.grupo.deleteMany();

        await prisma.$disconnect();
        console.log('Desconectado do banco de dados.');
    } catch (error) {
        console.error('Erro ao desconectar:', error);
    }
});

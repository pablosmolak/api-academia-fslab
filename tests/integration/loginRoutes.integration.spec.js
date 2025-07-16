import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';
import { gruposEnum } from '../../src/utils/enums.js';

let grupo;

beforeAll(async () => {
    grupo = await prisma.grupo.findFirst({
        where: {
            nome: { in: [gruposEnum.Alunos] },
        },
        select: { id: true },
    });
});



describe('Testes de Login', () => {
    let token;

    describe('Login básico e validação de token', () => {
        it('Deve fazer login', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: "dev@gmail.com",
                    senha: "Dev@1234"
                });

            token = res.body.data[0].token;

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('token');
        });

        it('Deve validar se o token é válido', async () => {
            const res = await request(app)
                .get('/login/check')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('payload');
            expect(res.body.data[0].payload).toHaveProperty('email');
        });
    });

    describe('Exceções de login', () => {
        it('Deve retornar erro se o usuário não existir', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: "inexistente@gmail.com",
                    senha: "q@ualquerSenha123"
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContain("Usuário ou senha incorretos!");
        });

        it('Deve retornar erro se a senha estiver incorreta', async () => {
            await prisma.usuario.create({
                data: {
                    nome: 'Teste Senha Errada',
                    email: 'senhaerrada@gmail.com',
                    senha: await bcrypt.hash('Senha@Correta123', 10),
                    ativo: true,
                    grupoId: grupo.id
                }
            });

            const res = await request(app)
                .post('/login')
                .send({
                    email: 'senhaerrada@gmail.com',
                    senha: 'SenhaInco@rreta123'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContain("Usuário ou senha incorretos!");
        });

        it('Deve retornar erro se o usuário estiver inativo', async () => {
            await prisma.usuario.create({
                data: {
                    nome: 'Teste Inativo',
                    email: 'inativo@gmail.com',
                    senha: await bcrypt.hash('Senha@Valida123', 10),
                    ativo: false,
                    grupoId: grupo.id
                }
            });

            const res = await request(app)
                .post('/login')
                .send({
                    email: 'inativo@gmail.com',
                    senha: 'Senha@Valida123'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContain("Usuário ou senha incorretos!");
        });

        it('Deve retornar erro de campos obrigatórios', async () => {
            const res = await request(app)
                .post('/login')
                .send({});

            expect(res.statusCode).toEqual(422);

            expect(res.body.errors).toContainEqual({
                path: 'email',
                message: 'Este campo é obrigatório'
            });

            expect(res.body.errors).toContainEqual({
                path: 'senha',
                message: 'Este campo é obrigatório'
            });
        });
    });
});

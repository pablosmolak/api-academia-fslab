import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';
import { gruposEnum } from '../../src/utils/enums.js';

let token;

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;
});

describe('Testes de recuperação de senha', () => {
    describe('/POST em recuperar senha', () => {
        it('Deve solicitar a recuperação de senha', async () => {
            const res = await request(app)
                .post('/recuperarsenha')
                .send({
                    email: "dev@gmail.com",
                    urlFront: "http://localhost:3000/recuperar-senha"
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
        });

        it('Deve retornar erro ao solicitar recuperação de senha para usuário inativo', async () => {
            const grupoId = (await prisma.grupo.findFirst({
                where: {
                    nome: { in: [gruposEnum.Professores] },
                },
                select: { id: true },
            })).id;


            await prisma.usuario.create({
                data: {
                    nome: "Usuário Inativo",
                    email: "inativo@example.com",
                    senha: "Senha@1234",
                    ativo: false,
                    grupoId: grupoId
                }
            });

            const res = await request(app)
                .post('/recuperarsenha')
                .send({
                    email: "inativo@example.com",
                    urlFront: "http://localhost:3000/recuperar-senha"
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual("Usuário inativo!");

        });

        it('Deve retornar código 200 para solicitação de recuperação de senha com usuário inexistente', async () => {
            const res = await request(app)
                .post('/recuperarsenha')
                .send({
                    email: "inexistente@example.com",
                    urlFront: "http://localhost:3000/recuperar-senha"
                });

            expect(res.statusCode).toEqual(200);
        })
    });

    describe('/POST em alterar senha', () => {
        it('Deve retornar erro ao tentar alterar senha de um usuário com um token invalido', async () => {
            const res = await request(app)
                .post('/alterarsenha')
                .query({
                    token: 'token',
                    email: "dev@gmail.com"
                })
                .send({
                    senha: "NovaSenha@1234"
                });

            expect(res.statusCode).toEqual(498);
            expect(res.body.errors).toContainEqual("Token inválido!");
        });

        it('Deve alterar a senha com token válido', async () => {
            const usuario = await prisma.usuario.findFirst({
                where: {
                    email: "dev@gmail.com"
                }
            });

            const token = usuario.tokenRecuperaSenha;
            const res = await request(app)
                .post('/alterarsenha')
                .query({
                    token,
                    email: "dev@gmail.com"
                })
                .send({
                    senha: "NovaSenha@1234"
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Requisição bem sucedida!');
        });

        it('Deve retornar erro de usuário inexistente', async () => {
            const usuario = await prisma.usuario.findFirst({
                where: {
                    email: "dev@gmail.com"
                }
            });

            const token = usuario.tokenRecuperaSenha;
            const res = await request(app)
                .post('/alterarsenha')
                .query({
                    token,
                    email: "teste@gmail.com"
                })
                .send({
                    senha: "NovaSenha@1234"
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Usuário não encontrado!");
        });

        it('Deve retornar erro ao tentar alterar senha de um usuário com o token inexistente', async () => {
            const res = await request(app)
                .post('/alterarsenha')
                .query({
                    token: 'token',
                    email: "inativo@example.com"
                })
                .send({
                    senha: "NovaSenha@1234"
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Recuperação de senha não solicitada ou já efetuada!");
        });

        it('Deve retornar erro ao tentar alterar senha de um usuário inativo', async () => {
            await prisma.usuario.update({
                where: {
                    email: 'inativo@example.com'
                },
                data: {
                    tokenRecuperaSenha: 'token1234'
                }
            })

            const res = await request(app)
                .post('/alterarsenha')
                .query({
                    token: 'token',
                    email: "inativo@example.com"
                })
                .send({
                    senha: "NovaSenha@1234"
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toContainEqual("Usuário inativo!");
        });

        it('Deve retornar erro ao solicitar recuperação de senha com token inválido', async () => {
            const grupoId = (await prisma.grupo.findFirst({
                where: {
                    nome: { in: [gruposEnum.Professores] },
                },
                select: { id: true },
            })).id;


            await prisma.usuario.create({
                data: {
                    nome: "Usuário teste",
                    email: "ativo@example.com",
                    senha: "Senha@1234",
                    ativo: true,
                    grupoId: grupoId,
                    tokenRecuperaSenha: "token123"
                }
            });

            const res = await request(app)
                .post('/alterarsenha')
                .query({
                    token: 'token123',
                    email: "ativo@example.com",
                })
                .send({
                    senha: "NovaSenha@1234"
                });

            expect(res.statusCode).toEqual(498);
            expect(res.body.errors).toContainEqual("Token inválido!");

        });
    });
});
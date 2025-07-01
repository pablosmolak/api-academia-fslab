import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import { gruposEnum } from '../../src/utils/enums.js';

let token;
let tokenVerificar;
let codigoVerificar;

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;

    const grupoId = (await prisma.grupo.findFirst({
        where: {
            nome: { in: [gruposEnum.Professores] },
        },
        select: { id: true },
    })).id;

    await prisma.usuario.create({
        data: {
            nome: 'Verificar da Silva',
            email: 'verificar@example.com',
            ativo: true,
            emailVerificado: false,
            senha: bcrypt.hashSync('Dev@1234', 10),
            grupoId: grupoId
        }
    })

    const resVerificar = await request(app)
        .post('/login')
        .send({
            email: "verificar@example.com",
            senha: "Dev@1234"
        });

    tokenVerificar = resVerificar.body.data[0].token;
});

describe('Teste de verificação de email', () => {
    describe('/POST em enviar codigo de recuperação', () => {
        it('Deve retornar erro ao solicitar o codigo de verificação de email para um usuário verificado', async () => {
            const res = await request(app)
                .post('/verificaremail/enviarcodigo')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContain("Email já verificado!");
        });

        it('Deve solicitar o codigo de verificação de email', async () => {
            const res = await request(app)
                .post('/verificaremail/enviarcodigo')
                .set('Authorization', `Bearer ${tokenVerificar}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('/POST em verificar email', () => {
        it('Deve retornar erro ao tentar verificar email de um usuário verificado', async () => {
            const res = await request(app)
                .post('/verificaremail')
                .send({
                    codigoVerificacaoEmail: '151515'
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "codigoVerificacaoEmail",
                message: "Email já verificado!"
            });
        });

        function gerarCodigoAlterado(codigoVerificar) {

            let novoCodigo = codigoVerificar;
            while (novoCodigo === codigoVerificar) {
                novoCodigo = Math.floor(100000 + Math.random() * 900000).toString(); // Gera número de 6 dígitos
            }

            return novoCodigo;
        }

        it('Deve retornar erro ao tentar verificar email com código inválido', async () => {
            codigoVerificar = (await prisma.usuario.findFirst({
                where: {
                    email: 'verificar@example.com'
                }
            })).codigoVerificacaoEmail;

            const res = await request(app)
                .post('/verificaremail')
                .send({
                    codigoVerificacaoEmail: gerarCodigoAlterado(codigoVerificar)
                })
                .set('Authorization', `Bearer ${tokenVerificar}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "codigoVerificacaoEmail",
                message: "Código de verificação inválido!"
            });
        });

        it('Deve verificar o email do usuário', async () => {
            const res = await request(app)
                .post('/verificaremail')
                .send({
                    codigoVerificacaoEmail: String(codigoVerificar)
                })
                .set('Authorization', `Bearer ${tokenVerificar}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao tentar verificar email com código expirado', async () => {
            await prisma.usuario.update({
                where: {
                    email: 'verificar@example.com'
                },
                data: {
                    emailVerificado: false,
                    codigoVerificacaoEmail: codigoVerificar,
                    expirationVerificacaoEmail: new Date(Date.now() - 30 * 60 * 1000)
                }
            })
            
            const res = await request(app)
                .post('/verificaremail')
                .send({
                    codigoVerificacaoEmail: String(codigoVerificar)
                })
                .set('Authorization', `Bearer ${tokenVerificar}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "codigoVerificacaoEmail",
                message: "Código de verificação expirado!"
            });
        });
    });
});
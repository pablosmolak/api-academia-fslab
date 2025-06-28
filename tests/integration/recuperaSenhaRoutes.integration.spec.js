import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';

let token;
let userId;
let certificado;
let cursoId;

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
                    email: "",
                    urlFront: "http://localhost:3000/recuperar-senha"
                });
        });
    });
});
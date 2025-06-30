import request from 'supertest';
import app from '../../src/app.js';

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

describe('Teste de verificação de email', () => {
    describe('/POST em enviar codigo de recuperação', () => {
        it('Deve solicitar o codigo de verificação de email', async () => {
            const res = await request(app)
                .post('/verificaremail/enviarcodigo')
                .set('Authorization', `Bearer ${token}`);

                console.log(res.body)

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
        })
    })
})
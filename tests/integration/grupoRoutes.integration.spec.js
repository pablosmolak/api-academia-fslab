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


describe('Testes de grupos', () => {
    describe('/GET em grupos', () => {
        it('Deve retornar os grupos', async () => {
            const res = await request(app)
                .get(`/grupos`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
import request from 'supertest';
import app from '../../src/app.js';

let token;
let categoriaId;

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;
});

describe('Testes de categoria', () => {

    describe('/POST em categorias', () => {
        it('Deve criar uma nova categoria', async () => {
            const res = await request(app)
                .post('/categorias')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Categoria Teste'
                });

            categoriaId = res.body.data[0].id;

            expect(res.statusCode).toEqual(201);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0].nome).toEqual('Categoria Teste');
        });

        it('Deve retornar erro ao criar categoria com nome duplicado', async () => {
            const res = await request(app)
                .post('/categorias')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Categoria Teste'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'nome',
                message: 'O campo Nome informado já está cadastrado!'
            });
        });
    })

    describe('/GET em categorias', () => {
        it('Deve listar todas as categorias', async () => {
            const res = await request(app)
                .get('/categorias')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('Deve retornar uma categoria específica pelo ID', async () => {
            const res = await request(app)
                .get(`/categorias/${categoriaId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0].nome).toBeDefined();
        });

        it('Deve retornar erro ao buscar categoria com ID inválido', async () => {
            const res = await request(app)
                .get('/categorias/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este id!');
        });
    })

    describe('/PATCH em categorias', () => {
        it('Deve alterar uma categoria existente', async () => {
            const res = await request(app)
                .patch(`/categorias/${categoriaId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Categoria Teste Alterada',
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao tentar alterar categoria com nome duplicado', async () => {
            await request(app)
                .post('/categorias')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Categoria Teste'
                });

            const res = await request(app)
                .patch(`/categorias/${categoriaId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Categoria Teste'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('O campo Nome informado já está cadastrado!');
        });

        it('Deve retornar erro ao tentar alterar categoria com ID inválido', async () => {
            const res = await request(app)
                .patch('/categorias/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Categoria Inexistente',
                    descricao: 'Descrição inexistente'
                });
            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este id!');
        });
    })

    describe('/DELETE em categorias', () => {
        it('Deve excluir uma categoria existente', async () => {
            const res = await request(app)
                .delete(`/categorias/${categoriaId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao tentar excluir categoria com ID inválido', async () => {
            const res = await request(app)
                .delete('/categorias/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este id!');
        });
    })
})
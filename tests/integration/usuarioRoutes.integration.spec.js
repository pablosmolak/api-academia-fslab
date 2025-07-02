import path from 'path';
import request from 'supertest';
import { fileURLToPath } from 'url';
import app from '../../src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let token;
let usuarioTesteOneId;
let usuarioAdministradorPadraoId;

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;
});



describe('Testes de Usuários', () => {
    describe('/POST em usuários', () => {
        it('Deve criar um usuário', async () => {
            const res = await request(app)
                .post('/usuarios')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "teste 1",
                    email: "testeone@example.com",
                    senha: "Teste@1234"
                });

            usuarioTesteOneId = res.body.data[0].id;

            expect(res.statusCode).toEqual(201);
            expect(res.body.data[0]).toHaveProperty('email');
        })

        it('Deve retornar erro ao criar usuário com email já existente', async () => {
            const res = await request(app)
                .post('/usuarios')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "teste 2",
                    email: "dev@gmail.com",
                    senha: "Teste@1234"
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'email',
                message: 'O endereço de e-mail informado já está em uso!'
            });
        })
    })

    describe('/GET em usuários', () => {

        it('Deve buscar uma lista de usuários', async () => {
            const res = await request(app)
                .get('/usuarios')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve buscar uma lista de usuários filtrada por email e nome', async () => {
            const res = await request(app)
                .get('/usuarios?nome=Administrador&email=dev@gmail.com')
                .set('Authorization', `Bearer ${token}`);

            usuarioAdministradorPadraoId = res.body.data[0].id;

            expect(res.statusCode).toEqual(200);
        });

        it('Deve buscar um usuário pelo ID', async () => {
            const res = await request(app)
                .get(`/usuarios/${usuarioTesteOneId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id', usuarioTesteOneId);
        })

        it('Deve retornar erro ao buscar usuário com ID inválido', async () => {
            const res = await request(app)
                .get('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContain("Usuário com ID 5a602dc4-f642-45d6-a082-8b285b182bb9 não encontrado!");
        });
    });

    describe('/PATCH em usuários', () => {
        it('Deve atualizar um usuário', async () => {

            const res = await request(app)
                .patch(`/usuarios/${usuarioTesteOneId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "teste atualizado",
                    email: "testeonee@example.com",
                    senha: "Teste@1234"
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao atualizar usuário com email já existente', async () => {
            const res = await request(app)
                .patch(`/usuarios/${usuarioTesteOneId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "teste atualizado",
                    email: "dev@gmail.com",
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'email',
                message: 'O endereço de e-mail informado já está em uso!'
            });
        });

        it('Deve retornar erro ao atualizar usuário com ID inválido', async () => {
            const res = await request(app)
                .patch('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: "teste atualizado",
                });

            expect(res.statusCode).toEqual(422);

            expect(res.body.errors).toContainEqual({
                path: 'id',
                message: 'Usuário com ID 5a602dc4-f642-45d6-a082-8b285b182bb9 não encontrado!'
            });
        });
    });

    describe('/POST em imagem de usuário', () => {

        it('Deve fazer upload de uma imagem de usuário', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');

            const res = await request(app)
                .post(`/usuarios/${usuarioAdministradorPadraoId}/image/upload`)
                .set('Authorization', `Bearer ${token}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(201); // ou o status que sua API retorna no sucesso
        });

        it('Deve retornar erro ao tentar fazer upload de uma imagem de usuário sem validar o email', async () => {
            const login = await request(app)
                .post('/login')
                .send({
                    email: "testeonee@example.com",
                    senha: "Teste@1234"
                });

            const tokenTesteOne = login.body.data[0].token;

            const res = await request(app)
                .post(`/usuarios/${usuarioTesteOneId}/image/upload`)
                .set('Authorization', `Bearer ${tokenTesteOne}`)

            expect(res.statusCode).toBe(401);
            expect(res.body.errors).toContainEqual("Email não verificado!");
        });

        it('Deve alterar a imagem de um usuário', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');

            const res = await request(app)
                .post(`/usuarios/${usuarioAdministradorPadraoId}/image/upload`)
                .set('Authorization', `Bearer ${token}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(201); // ou o status que sua API retorna no sucesso
        });

        it('Deve retornar erro ao fazer upload de uma imagem de usuário com ID inválido', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');
            const res = await request(app)
                .post('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9/image/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(422);
            expect(res.body.errors).toContainEqual("Usuário com ID 5a602dc4-f642-45d6-a082-8b285b182bb9 não encontrado!");
        })


        it('Deve retornar erro ao fazer upload de uma imagem de usuário sem arquivo', async () => {
            const res = await request(app)
                .post('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9/image/upload')
                .set('Authorization', `Bearer ${token}`);


            expect(res.statusCode).toBe(422);
            expect(res.body.errors).toContainEqual("Nenhum arquivo foi enviado!");
        })

        it('Deve retornar erro ao fazer upload de uma imagem de usuário com tipo de arquivo inválido', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.txt');
            const res = await request(app)
                .post(`/usuarios/${usuarioAdministradorPadraoId}/image/upload`)
                .set('Authorization', `Bearer ${token}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(422);
            expect(res.body.errors).toContainEqual("O arquivo enviado não é uma imagem válida, os tipos aceitos são: image/jpeg, image/jpg, image/png, image/webp!");
        })
    });

    describe('/GET em imagem de usuário', () => {
        it('Deve buscar a imagem de um usuário', async () => {
            const res = await request(app)
                .get(`/usuarios/${usuarioAdministradorPadraoId}/image`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao buscar imagem de usuário com ID inválido', async () => {
            const res = await request(app)
                .get('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9/image')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Usuário com ID 5a602dc4-f642-45d6-a082-8b285b182bb9 não encontrado!");
        })

        it('Deve retornar erro ao buscar imagem de usuário sem imagem', async () => {
            const res = await request(app)
                .get(`/usuarios/${usuarioTesteOneId}/image`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual("Não foi possivel encontrar o arquivo");
        });
    })

    describe('/DELETE em usuários', () => {
        it('Deve deletar um usuário', async () => {
            const login = await request(app)
                .post('/login')
                .send({
                    email: "testeonee@example.com",
                    senha: "Teste@1234"
                });

            const tokenTesteOne = login.body.data[0].token;

            const res = await request(app)
                .delete(`/usuarios/${usuarioTesteOneId}`)
                .set('Authorization', `Bearer ${tokenTesteOne}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao deletar usuário com ID inválido', async () => {
            const res = await request(app)
                .delete('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Usuário com ID 5a602dc4-f642-45d6-a082-8b285b182bb9 não encontrado!");
        });

        it('Deve retornar erro ao tentar deletar o usuário Administrador Padrão', async () => {
            const res = await request(app)
                .delete(`/usuarios/${usuarioAdministradorPadraoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("O usuário Administrador padrão não pode ser deletado!");
        })
    });

    describe('/DELETE em imagem de usuário', () => {
        it('Deve deletar a imagem de um usuário', async () => {
            const res = await request(app)
                .delete(`/usuarios/${usuarioAdministradorPadraoId}/image/delete`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao deletar imagem de usuário com ID inválido', async () => {
            const res = await request(app)
                .delete('/usuarios/5a602dc4-f642-45d6-a082-8b285b182bb9/image/delete')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'id',
                message: 'Usuário com ID 5a602dc4-f642-45d6-a082-8b285b182bb9 não encontrado!'
            });
        });
    });
});

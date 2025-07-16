import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';

let token;
let tokenProfessor;
let curso;
let userId;
let topicoId;
let topicoTeste

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;
    userId = res.body.data[0].payload.id

    const resProfessor = await request(app)
        .post('/login')
        .send({
            email: "professor@gmail.com",
            senha: "Dev@1234"
        });

    tokenProfessor = resProfessor.body.data[0].token;

    curso = await prisma.curso.create({
        data: {
            nome: 'Curso de teste',
            descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                        Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                        descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                        inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                        estabelecidas.`,
            cargaHoraria: 1000,
            criador: userId,
            publicado: true
        }
    });

    topicoTeste = await prisma.topico.create({
        data: {
            ordem: 1,
            titulo: "Tópico teste 1",
            cursoId: curso.id
        }
    })
});

describe('Testes de tópico', () => {
    describe('/POST em tópicos', () => {
        it('Deve retornar erro de id de curso inválido', async () => {
            const res = await request(app)
                .post(`/topicos`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Tópico 1',
                    cursoId: 'f6efef75-1904-41c2-9ec0-c2cc58b067f3'
                })

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                message: "Nenhum registro encontrado com este CursoId!",
                path: "cursoId"
            });
        });

        it('Deve criar um tópico', async () => {
            const res = await request(app)
                .post(`/topicos`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Tópico 1',
                    cursoId: curso.id
                })

            topicoId = res.body.data[0].id

            expect(res.statusCode).toEqual(201);
        });

        it('Deve retornar erro de titulo já existente', async () => {
            const res = await request(app)
                .post(`/topicos`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Tópico 1',
                    cursoId: curso.id
                })

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                message: "Já existe um tópico com este título neste curso.",
                path: "titulo"
            });
        });
        
        it('Deve retornar erro de usuário sem permissão para criar tópico', async () => {
            const res = await request(app)
                .post(`/topicos`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    titulo: 'Tópico 1',
                    cursoId: curso.id
                })

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual('Usuário sem permissão para criar um topico para o curso!');
        });
    });

    describe('/GET em tópicos', () => {
        it('Deve retornar um topico por id', async () => {
            const res = await request(app)
                .get(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao buscar um topico com id inválido', async () => {
            const res = await request(app)
                .get(`/topicos/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este ID!');
        });

        it('Deve retornar erro ao buscar um topico com id de curso inválido', async () => {
            const res = await request(app)
                .get(`/topicos/curso/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este ID!');
        });

        it('Deve retornar topicos do curso', async () => {
            const res = await request(app)
                .get(`/topicos/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
    });

    describe('/PATCH em tópicos', () => {
        it('Deve retornar erro ao tentar alterar um tópico com id inválido', async () => {
            const res = await request(app)
                .patch(`/topicos/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este id!');
        });

        it('Deve alterar um tópico', async () => {
            const res = await request(app)
                .patch(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Topico'
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve alterar um tópico para uma ordem menor', async () => {
            const res = await request(app)
                .patch(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ordem: 1,
                    titulo: 'Topico'
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve alterar um tópico para uma ordem maior', async () => {
            const res = await request(app)
                .patch(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ordem: 2,
                    titulo: 'Topico'
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retonar erro ao tentar alterar o titulo já existente', async () => {
            const res = await request(app)
                .patch(`/topicos/${topicoTeste.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Topico'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'titulo',
                message: 'Já existe um tópico com este título neste curso.'
            });
        });
       
        it('Deve retonar erro ao tentar alterar um tópico com um usuário com permissão', async () => {
            const res = await request(app)
                .patch(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    titulo: 'Topico'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual('Usuário sem permissão para alterar o tópico!');
        });

    })

    describe('/DELETE em tópicos', () => {
        it('Deve retornar erro ao tentar deletar um tópico com o id inválido', async () => {
            const res = await request(app)
                .delete(`/topicos/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Topico não encontrado!");
        });
        
        it('Deve retornar erro se usuário sem permissão para deletar o tópico', async () => {
            const res = await request(app)
                .delete(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para deletar o tópico!");
        });

        it('Deve deletar um tópico', async () => {
            const res = await request(app)
                .delete(`/topicos/${topicoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
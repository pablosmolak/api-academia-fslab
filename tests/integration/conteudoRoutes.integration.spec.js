import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';


let token;
let curso;
let topico;
let tokenProfessor;
let conteudoId;

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;
    const userId = res.body.data[0].payload.id

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
            criador: userId
        }
    })

    topico = await prisma.topico.create({
        data: {
            ordem: 1,
            titulo: 'Topico teste',
            cursoId: curso.id
        }
    })

});

describe('Teste de conteúdos', () => {
    describe('/POST em conteúdos', () => {
        it('Deve criar um conteúdo', async () => {
            const res = await request(app)
                .post('/conteudos')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    topicoId: topico.id,
                    titulo: 'Conteúdo teste',
                    tipo: "Youtube URL",
                    cargaHoraria: '10:00:00',
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            conteudoId = res.body.data[0].id

            expect(res.statusCode).toEqual(201);
        })

        it('Deve retornar erro de tópico inválido', async () => {
            const res = await request(app)
                .post('/conteudos')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    topicoId: 'e6c0dd82-6c32-40d7-a59d-0d8c89769c94',
                    titulo: 'Conteúdo teste',
                    tipo: "Youtube URL",
                    cargaHoraria: '10:00:00',
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "topicoId",
                message: "Nenhum registro encontrado com este topicoId!"
            });
        });

        it('Deve retornar erro de titulo de topico ja existente', async () => {
            const res = await request(app)
                .post('/conteudos')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    topicoId: topico.id,
                    titulo: 'Conteúdo teste',
                    tipo: "Youtube URL",
                    cargaHoraria: '10:00:00',
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "titulo",
                message: "Já existe um conteúdo com este título neste tópico."
            });
        });

        it('Deve retornar erro de conteúdo inválido', async () => {
            const res = await request(app)
                .post('/conteudos')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    topicoId: topico.id,
                    titulo: 'Conteúdo teste 2 ',
                    tipo: "Youtube URL",
                    cargaHoraria: '10:00:00',
                    conteudo: 'https://api-academia.app.fslab.dev'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'conteudo',
                message: 'O conteúdo informado não é um link do youtube'
            });
        });

        it('Deve retornar erro de usuário sem permissão', async () => {
            const res = await request(app)
                .post('/conteudos')
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    topicoId: topico.id,
                    titulo: 'Conteúdo teste 2',
                    tipo: "Youtube URL",
                    cargaHoraria: '10:00:00',
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para criar um conteúdo para esse tópico do curso!");
        });
    });

    describe('/GET em conteúdo por id', () => {
        it('Deve retornar um conteúdo por id', async () => {
            const res = await request(app)
                .get(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id', conteudoId);
        });

        it('Deve retornar erro ao buscar um conteúdo com id inválido', async () => {
            const res = await request(app)
                .get(`/conteudos/8e86fa50-c6bd-440e-b284-74a98b22bedd`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual("Nenhum registro encontrado com este ID!");
        });
    });

    describe('/GET em conteúdo por topico', () => {
        it('Deve retornar os conteúdos de um tópico especifico', async () => {
            const res = await request(app)
                .get(`/conteudos/topico/${topico.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        })

        it('Deve retonar erro ao buscar um conteúdos com id de tópico inválido', async () => {
            const res = await request(app)
                .get(`/conteudos/topico/8e86fa50-c6bd-440e-b284-74a98b22bedd`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual("Nenhum registro encontrado com este ID!");
        })
    })

    describe('/PATCH em conteúdos', () => {
        it('Deve alterar um conteúdo', async () => {
            const res = await request(app)
                .patch(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Conteúdo teste',
                    tipo: "Youtube URL",
                    cargaHoraria: '09:00:00',
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao tentar alterar um conteúdo com o id inválido', async () => {
            const res = await request(app)
                .patch(`/conteudos/8e86fa50-c6bd-440e-b284-74a98b22bedd`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Conteúdo teste',
                    tipo: "Youtube URL",
                    cargaHoraria: '09:00:00',
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este id!');
        });

        it('Deve retornar erro ao tentar alterar o titulo do conteúdo para um titulo existente', async () => {
            const conteudoTeste = await prisma.conteudoCurso.create({
                data: {
                    ordem: 2,
                    titulo: 'Conteúdo teste 3',
                    tipo: "Youtube URL",
                    cargaHoraria: 180,
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti',
                    topicoId: topico.id,
                }
            })

            const res = await request(app)
                .patch(`/conteudos/${conteudoTeste.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titulo: 'Conteúdo teste'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'titulo',
                message: 'Já existe um conteúdo com este título neste tópico.'
            });
        })

        it('Deve retornar erro ao tentar alterar o conteúdo para um conteúdo inválido', async () => {
            const res = await request(app)
                .patch(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    conteudo: 'https://api-academia.app.fslab.dev'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'conteudo',
                message: 'O conteúdo informado não é um link do youtube'
            });
        });

        it('Deve retornar erro de usuário sem permissão para alterar conteúdo', async () => {
            const res = await request(app)
                .patch(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para alterar um conteúdo para esse tópico do curso!");
        });

        it('Deve alterar um conteúdo para um numero de ordem maior', async () => {
            const res = await request(app)
                .patch(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ordem: 2
                });

            expect(res.statusCode).toEqual(200);
        });

        it('Deve alterar um conteúdo para um numero de ordem menor', async () => {
            const res = await request(app)
                .patch(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ordem: 1
                });

            expect(res.statusCode).toEqual(200);
        });
    });

    describe('/DELETE em conteúdos', () => {
        it('Deve retornar erro ao tentar deletar um conteúdo com id inválido', async () => {
            const res = await request(app)
                .delete(`/conteudos/8e86fa50-c6bd-440e-b284-74a98b22bedd`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual("Conteúdo não encontrado!");
        });

        it('Deve retornar erro ao tentar deletar um conteúdo sem permissão', async () => {
            const res = await request(app)
                .delete(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para deletar um conteúdo para esse tópico do curso!");
        });

        it('Deve deletar um conteúdo', async () => {
            const res = await request(app)
                .delete(`/conteudos/${conteudoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
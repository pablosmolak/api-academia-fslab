import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';
import { tiposConteudosEnum } from '../../src/utils/enums.js';

let token;
let tokenProfessor;
let curso;
let curso2;
let topico;
let userId;
let conteudo1;

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

    curso2 = await prisma.curso.create({
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

    topico = await prisma.topico.create({
        data: {
            ordem: 1,
            titulo: 'Topico teste',
            cursoId: curso.id
        }
    })

    conteudo1 = await prisma.conteudoCurso.create({
        data: {
            conteudo: 'https://www.youtube.com/watch?v=Cu2Ztw2IBzI&ab_channel=PadreReginaldoManzotti',
            ordem: 1,
            tipo: tiposConteudosEnum.UrlYoutube,
            cargaHoraria: 800,
            titulo: 'video',
            topicoId: topico.id,
        },
    });
});

describe('Testes de inscricões', () => {
    describe('/POST em inscricões', () => {
        it('Deve retornar erro tentar se increver em um curso com id inválido', async () => {
            const res = await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: 'f6efef75-1904-41c2-9ec0-c2cc58b067f3'
                })

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Nenhum curso publicado encontrado com esse ID");
        });

        it('Deve retornar erro tentar se increver em um curso sem tópicos', async () => {
            const res = await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: curso2.id
                })

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Não é possivel se inscrever em um curso sem tópicos");
        });

        it('Deve se inscrever em um curso', async () => {
            const res = await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: curso.id
                });

            expect(res.statusCode).toEqual(201);
        });

        it('Deve retornar erro tentar se increver em um curso que já está inscrito', async () => {
            const res = await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: curso.id
                })

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual("Já existe uma inscrição neste curso para o usuário");
        });
    });

    describe('/GET em inscricões', () => {
        it('Deve retornar todas inscricões com base nos filtros', async () => {
            const res = await request(app)
                .get(`/inscricoes`)
                .query({
                    cursoId: curso.id,
                    usuarioId: userId
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
       
        it('Deve retornar todas que o usuario tem acesso', async () => {
            const res = await request(app)
                .get(`/inscricoes`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(200);
        });
    });

    describe('/GET em inscricões do usuário logado', () => {
        it('Deve retornar inscricões', async () => {
            const res = await request(app)
                .get(`/inscricoes/usuario`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar inscricões por id', async () => {
            const res = await request(app)
                .get(`/inscricoes/usuario/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao buscar inscricões com id inválido', async () => {
            const res = await request(app)
                .get(`/inscricoes/usuario/curso/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "cursoId",
                message: "Nenhum registro encontrado com este id do curso!"
            });
        });
    });

    describe('/DELETE em inscrições', () => {
        it('Deve retornar erro ao tentar deletar uma inscrição com id inválido', async () => {
            const res = await request(app)
                .delete(`/inscricoes/usuario/curso/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este cursoId!');
        });

        it('Deve deletar uma inscrição', async () => {
            const res = await request(app)
                .delete(`/inscricoes/usuario/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao tentar deletar uma inscrição em um curso que não está inscrito', async () => {
            const res = await request(app)
                .delete(`/inscricoes/usuario/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Inscrição não encontrada!');
        });

        it('Deve retornar erro ao tentar deletar uma inscrição em um curso que ja finalizou todas as atividades', async () => {
            await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: curso.id
                });

            await request(app)
                .post(`/progressos/finalizaratividade/${conteudo1.id}`)
                .set('Authorization', `Bearer ${token}`);

            const res = await request(app)
                .delete(`/inscricoes/usuario/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Você não pode excluir uma inscrição de um curso que você já finalizou!');
        });
    })
});
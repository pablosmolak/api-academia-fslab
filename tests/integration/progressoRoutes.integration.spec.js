import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';
import { tiposConteudosEnum } from '../../src/utils/enums.js';

let token;
let tokenProfessor;
let curso;
let topico;
let userId;
let conteudo1;
let conteudo2;

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

    conteudo2 = await prisma.conteudoCurso.create({
        data: {
            conteudo: 'https://www.youtube.com/watch?v=OutraUrlExemplo',
            ordem: 2,
            tipo: tiposConteudosEnum.UrlYoutube,
            cargaHoraria: 900,
            titulo: 'Outro vídeo',
            topicoId: topico.id,
        },
    });
});

describe('Testes de progresso', () => {
    describe('/GET em progressos', () => {
        it('Deve retornar todos os progressos com base nos filtros', async () => {
            const res = await request(app)
                .get(`/progressos`)
                .query({
                    cursoId: curso.id,
                    usuarioId: userId
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
        
        it('Deve retornar todos os progressos que o usuario tem acesso', async () => {
            const res = await request(app)
                .get(`/progressos`)
                .query({
                    cursoId: curso.id,
                    usuarioId: userId
                })
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(200);
        });
    });

    describe('/GET em progresso do usuário no curso', () => {
        it('Deve retornar erro ao buscar progresso em um curso não inscrito', async () => {
            const res = await request(app)
                .get(`/progressos/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual("Nenhum progresso encontrado nesse curso para esse usuário!");
        });

        it('Deve retornar erro ao buscar progresso em um curso não existente', async () => {
            const res = await request(app)
                .get(`/progressos/curso/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "cursoId",
                message: "Nenhum registro encontrado com este id do curso!"
            });
        });

        it('Deve retornar o progresso do usuário em um curso', async () => {
            await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: curso.id
                });

            const res = await request(app)
                .get(`/progressos/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('atividadeAtual', conteudo1.id);
        });
    });

    describe('/POST em finalizar atividade', () => {
        it('Deve retornar erro ao tentar finalizar uma atividade em que o usuário não está inscrito no curso', async () => {
            await request(app)
                .delete(`/inscricoes/usuario/curso/${curso.id}`)
                .set('Authorization', `Bearer ${token}`)

            const res = await request(app)
                .post(`/progressos/finalizaratividade/${conteudo1.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "conteudoid",
                message: "Usuário não inscrito no curso"
            });
        });

        it('Deve retornar erro ao tentar finalizar uma atividade com id inválido', async () => {
            const res = await request(app)
                .post(`/progressos/finalizaratividade/f6efef75-1904-41c2-9ec0-c2cc58b067f3`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "conteudoid",
                message: "Não existe conteúdo com o ID informado!"
            });
        });

        it('Deve finalizar uma atividade', async () => {
            await request(app)
                .post(`/inscricoes`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    cursoId: curso.id
                });

            const res = await request(app)
                .post(`/progressos/finalizaratividade/${conteudo1.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(201);
        });

        it('Deve retornar erro ao tentar finalizar uma atividade já finalizada', async () => {
            const res = await request(app)
                .post(`/progressos/finalizaratividade/${conteudo1.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "conteudoid",
                message: "O conteúdo informado já estava concluído!"
            });
        });

        it('Deve finalizar o curso', async () => {
            const res = await request(app)
                .post(`/progressos/finalizaratividade/${conteudo2.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(201);
            expect(res.body.data[0]).toHaveProperty('certificado');
        });
    });
});
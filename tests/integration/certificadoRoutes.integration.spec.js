import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';

let token;
let tokenProfessor;
let userId;
let certificado;
let cursoId;
let cursoIdSemCertificado;

beforeAll(async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    token = res.body.data[0].token;
    userId = res.body.data[0].payload.id;

    const resProfessor = await request(app)
        .post('/login')
        .send({
            email: "professor@gmail.com",
            senha: "Dev@1234"
        });

    tokenProfessor = resProfessor.body.data[0].token;

    cursoId = (await prisma.curso.create({
        data: {
            nome: 'Curso Teste 299',
            descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                    Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                    descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                    inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                    estabelecidas.`,
        }
    })).id;
   
    cursoIdSemCertificado = (await prisma.curso.create({
        data: {
            nome: 'Curso Teste 299',
            descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                    Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                    descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                    inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                    estabelecidas.`,
        }
    })).id;

    certificado = await prisma.certificado.create({
        data: {
            validador: 'validacao123',
            userId: userId,
            cursoId: cursoId
        }
    });
});

describe('Testes de certificado', () => {
    describe('/GET em certificados', () => {
        it('Deve listar todos os certificados com base nos filtros', async () => {
            const res = await request(app)
                .get(`/certificados?cursoId=${cursoId}&usuarioId=${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });
        
        it('Deve listar todos os certificados que o usuario tiver acesso', async () => {
            const res = await request(app)
                .get(`/certificados?cursoId=${cursoId}&usuarioId=${userId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve listar certificados do um usuário logado', async () => {
            const res = await request(app)
                .get(`/certificados/usuario`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        })

        it('Deve listar certificados do usuário logado por curso', async () => {
            const res = await request(app)
                .get(`/certificados/usuario/curso/${cursoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao listar certificados do usuário logado por curso com cursoId inválido', async () => {
            const res = await request(app)
                .get('/certificados/usuario/curso/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "cursoId",
                message: "Nenhum registro encontrado com este id do curso!"
            });
        });
       
        it('Deve retornar erro ao listar certificados do usuário logado por curso com cursoId que não existe certificado', async () => {
            const res = await request(app)
                .get(`/certificados/usuario/curso/${cursoIdSemCertificado}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: "cursoId",
                message: "Nenhum certificado encontrado para esse curso!"
            });
        });

        it('Deve validar um certificado existente', async () => {
            const res = await request(app)
                .get(`/certificados/validar/${certificado.validador}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao validar um certificado inexistente', async () => {
            const res = await request(app)
                .get('/certificados/validar/validadorInexistente');

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: "id",
                message: "Nenhum certificado encontrado com esse validador"
            });
        });
    });
});
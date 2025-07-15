import path from 'path';
import request from 'supertest';
import { fileURLToPath } from 'url';
import app from '../../src/app.js';
import { prisma } from '../../src/config/prismaClient.js';
import { tiposConteudosEnum } from '../../src/utils/enums.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tokenAdmin;
let tokenProfessor;
let categoriaId;
let categoriaId2;
let cursoId;
let cursoIdAlterar;
let topicoId;
let instrutorId;

beforeAll(async () => {
    const resAdmin = await request(app)
        .post('/login')
        .send({
            email: "dev@gmail.com",
            senha: "Dev@1234"
        });

    tokenAdmin = resAdmin.body.data[0].token;

    const resProfessor = await request(app)
        .post('/login')
        .send({
            email: "professor@gmail.com",
            senha: "Dev@1234"
        });

    tokenProfessor = resProfessor.body.data[0].token;
    instrutorId = resProfessor.body.data[0].payload.id;

    categoriaId = (await prisma.categoria.create({
        data: {
            nome: 'Categoria Teste'
        }
    }))?.id
    
    categoriaId2 = (await prisma.categoria.create({
        data: {
            nome: 'Categoria Teste 2'
        }
    }))?.id

    cursoIdAlterar = (await prisma.curso.create({
        data: {
            nome: 'Curso Teste Alterar',
            descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                    Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                    descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                    inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                    estabelecidas.`,
            criador: instrutorId
        }
    }))?.id
});

describe('Testes de Curso', () => {

    describe('/POST em cursos', () => {
        it('Deve criar um novo curso', async () => {
            const res = await request(app)
                .post('/cursos')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    nome: 'Curso Teste',
                    descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                    Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                    descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                    inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                    estabelecidas.`,
                    categoria: [categoriaId]
                });

            cursoId = res.body.data[0].id;

            expect(res.statusCode).toEqual(201);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0].nome).toEqual('Curso Teste');
        });

        it('Deve retornar erro ao criar curso com nome duplicado', async () => {
            const res = await request(app)
                .post('/cursos')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    nome: 'Curso Teste',
                    descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                    Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                    descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                    inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                    estabelecidas.`
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'nome',
                message: 'O campo Nome informado já está cadastrado!'
            });
        });

        it('Deve retornar erro ao criar curso com categoria inválida', async () => {
            const res = await request(app)
                .post('/cursos')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    nome: 'Curso Teste 3',
                    descricao: `Este teste tem como objetivo validar o correto funcionamento das funcionalidades relacionadas aos cursos na aplicação. 
                    Ele garante que seja possível criar, listar, atualizar e excluir cursos, além de verificar se os campos obrigatórios, como nome, 
                    descrição e categoria, estão sendo devidamente validados pelo sistema. Também são testados os cenários de erro, como envio de dados 
                    inválidos ou requisições com campos faltantes, assegurando que as respostas da API estejam em conformidade com as regras de negócio 
                    estabelecidas.`,
                    categoria: ['5a602dc4-f642-45d6-a082-8b285b182bb9']
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'categoria',
                message: 'Nenhuma categoria encontrada com os IDS: 5a602dc4-f642-45d6-a082-8b285b182bb9'
            });
        })
    });

    describe('\PATCH em cursos', () => {
        it('Deve alterar informacões de um curso', async () => {
            const res = await request(app)
                .patch(`/cursos/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    nome: 'Curso legal',
                    categoria:[categoriaId2]
                });

            expect(res.statusCode).toEqual(200);
        })

        it('Deve retornar erro de id de curso inválido', async () => {
            const res = await request(app)
                .patch(`/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    nome: 'Curso legal'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual('Nenhum registro encontrado com este id!')
        })

        it('Deve retornar erro de usuário sem permissão para alterar o curso', async () => {
            const res = await request(app)
                .patch(`/cursos/${cursoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    nome: 'Curso legal'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual('Usuário sem permissão para alterar o curso!')
        })

        it('Deve retornar erros ao tentar alterar um curso com dados inválidos', async () => {
            const res = await request(app)
                .patch(`/cursos/${cursoIdAlterar}`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    nome: 'Curso legal',
                    categoria: ['5a602dc4-f642-45d6-a082-8b285b182bb9']
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'nome',
                message: 'Já existe um curso com este nome.'
            });
            expect(res.body.errors).toContainEqual({
                path: 'categoria',
                message: 'Nenhuma categoria encontrada com os IDS: 5a602dc4-f642-45d6-a082-8b285b182bb9'
            });
        })
    })

    describe('/POST em instrutores do curso', () => {

        it('Deve retornar erro ao adicionar instrutores ao curso sem permissão', async () => {
            const res = await request(app)
                .post(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    usersID: [instrutorId]
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para adicionar instrutures ao curso!");
        })

        it('Deve retornar erro ao adicionar instrutores ao curso com ID de usuário inválido', async () => {
            const res = await request(app)
                .post(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usersID: ['5a602dc4-f642-45d6-a082-8b285b182bb9']
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "usersID",
                message: "Nenhum registro encontrado com este ID do Usuário: 5a602dc4-f642-45d6-a082-8b285b182bb9!"
            });
        })

        it('Deve adicionar instrutores ao curso', async () => {
            const res = await request(app)
                .post(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usersID: [instrutorId]
                });

            expect(res.statusCode).toEqual(201);
        });

        it('Deve retornar erro ao adicionar instrutores ao curso com ID inválido', async () => {
            const res = await request(app)
                .post('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9/instrutores')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usersID: [instrutorId]
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "cursoID",
                message: "Nenhum registro encontrado com este id do curso!"
            });
        })
    });

    describe('/GET em instrutores do curso', () => {
        it('Deve listar instrutores do curso', async () => {
            const res = await request(app)
                .get(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0].id).toEqual(instrutorId);
        })

        it('Deve retornar erro ao listar instrutores de um curso com ID inválido', async () => {
            const res = await request(app)
                .get('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9/instrutores')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: "cursoID",
                message: "Nenhum registro encontrado com este id!"
            });
        });
    });

    describe('/GET em alterar status dos cursos', () => {
        it('Deve retornar erro ao alterar status de curso que ainda não tem topicos', async () => {
            const res = await request(app)
                .patch(`/cursos/alterarstatus/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    status: 'publicado'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'topicos',
                message: 'O curso não pode ser publicado sem tópicos!'
            });
        });

        it('Deve retornar erro ao alterar status de curso que tem topicos sem conteúdos', async () => {
            topicoId = (await prisma.topico.create({
                data: {
                    ordem: 1,
                    titulo: 'Topico Teste',
                    cursoId: cursoId
                }
            }))?.id;

            const res = await request(app)
                .patch(`/cursos/alterarstatus/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    status: 'publicado'
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: 'topicos',
                message: 'O curso não pode ser publicado sem cada tópico do curso ter ao menos um conteúdo!'
            });
        });

        it('Deve Alterar status de curso para publicado com sucesso - Admin', async () => {
            await prisma.conteudoCurso.create({
                data: {
                    ordem: 1,
                    titulo: 'Topico Teste',
                    conteudo: 'https://www.youtube.com/watch?v=etqdYiJDstk&ab_channel=Rep%C3%BAblicaCoisadeNerd',
                    cargaHoraria: 500,
                    tipo: tiposConteudosEnum.UrlYoutube,
                    topicoId: topicoId
                }
            })

            const res = await request(app)
                .patch(`/cursos/alterarstatus/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    status: 'publicado'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('publicado', true);
        });

        it('Deve Alterar status de curso para despublicado com sucesso - Admin', async () => {
            const res = await request(app)
                .patch(`/cursos/alterarstatus/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    status: 'publicado'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('publicado', false);
        });

        it('Deve retornar erro ao alterar status de curso sem permissão', async () => {
            await prisma.instrutores.delete({
                where: {
                    cursoId_userId: {
                        cursoId: cursoId,
                        userId: instrutorId
                    }
                }
            })

            const res = await request(app)
                .patch(`/cursos/alterarstatus/${cursoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    status: 'publicado'
                });

            expect(res.statusCode).toEqual(403);
            expect(res.body.errors).toContainEqual({
                path: "id",
                message: "Sem permissão para alterar o status do curso"
            });
        });

        it('Deve Alterar status de curso para publicado com sucesso - Professor', async () => {
            await prisma.instrutores.create({
                data: {
                    cursoId: cursoId,
                    userId: instrutorId
                }
            })

            const res = await request(app)
                .patch(`/cursos/alterarstatus/${cursoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    status: 'publicado'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('publicado', true);
        });
    })

    describe('/GET em cursos publicados', () => {
        it('Deve listar todos os cursos publicados', async () => {
            const res = await request(app)
                .get('/cursos/publicados')
                .query({
                    filtro:'teste'
                })
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve buscar um curso publicado pelo ID', async () => {
            const res = await request(app)
                .get(`/cursos/publicados/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0].id).toEqual(cursoId);
        });

        it('Deve retornar erro ao buscar um curso publicado com ID inválido', async () => {
            const res = await request(app)
                .get('/cursos/publicados/9e870aa9-0c32-4fba-84f1-251674ae24f5')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: 'id',
                message: 'Nenhum curso publicado encontrado com esse ID!'
            });
        });
    });

    describe('/GET em cursos', () => {

        it('Deve listar todos os cursos - Admin', async () => {
            const res = await request(app)
                .get('/cursos/todos')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve listar todos os cursos - Professor', async () => {
            const res = await request(app)
                .get('/cursos/todos')
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve listar todos os cursos por id - Admin', async () => {
            const res = await request(app)
                .get(`/cursos/todos/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve listar todos os cursos por id - Professor', async () => {
            const res = await request(app)
                .get(`/cursos/todos/${cursoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao buscar um curso com ID inválido', async () => {
            const res = await request(app)
                .get(`/cursos/todos/9e870aa9-0c32-4fba-84f1-251674ae24f5`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: 'id',
                message: 'Nenhum curso encontrado com esse ID!'
            });
        });
    })

    describe('/GET em informações do curso', () => {

        it('Deve listar informações do curso', async () => {
            const res = await request(app)
                .get(`/cursos/publicados/informacoes/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0].id).toEqual(cursoId);
        });

        it('Deve retornar erro ao buscar informações de um curso com ID inválido', async () => {
            const res = await request(app)
                .get('/cursos/publicados/informacoes/9e870aa9-0c32-4fba-84f1-251674ae24f5')
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: "id",
                message: "Nenhum curso publicado encontrado com esse ID"
            });
        });
    });

    describe('/DELETE em instrutores do curso', () => {
        it('Deve deletar um instrutor de um curso', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usersID: [instrutorId]
                });

            expect(res.statusCode).toEqual(200);
        })

        it('Deve retornar erro ao deletar um instrutor de um curso com ID inválido', async () => {
            const res = await request(app)
                .delete('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9/instrutores')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usersID: [instrutorId]
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                message: "Nenhum registro encontrado com este id do curso!",
                path: "cursoID"
            })
        });

        it('Deve retornar erro ao tentar deletar um instrutor de um curso com ID de usuário inválido', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usersID: ['5a602dc4-f642-45d6-a082-8b285b182bb9']
                });

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                message: "Nenhum registro encontrado com este ID do Usuário: 5a602dc4-f642-45d6-a082-8b285b182bb9!",
                path: "usersID"
            });
        });

        it('Deve retornar erro ao tentar deletar um instrutor de um sem permissão', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}/instrutores`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .send({
                    usersID: [instrutorId]
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para remover instrutures do curso!");
        })
    });

    describe('/POST em imagem de capa do curso', () => {

        it('Deve fazer upload de uma capa para o curso', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');

            const res = await request(app)
                .post(`/cursos/${cursoId}/capa/upload`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(201); // ou o status que sua API retorna no sucesso
        });

        it('Deve alterar a capa de um curso', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');

            const res = await request(app)
                .post(`/cursos/${cursoId}/capa/upload`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(201); // ou o status que sua API retorna no sucesso
        });

        it('Deve retornar erro ao fazer upload de uma capa de curso com ID inválido', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');
            const res = await request(app)
                .post('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9/capa/upload')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(422);
            expect(res.body.errors).toContainEqual({
                message: "Nenhum registro encontrado com este id!",
                path: "cursoid"
            });
        })

        it('Deve retornar erro ao tentar fazer upload de uma capa de curso sem permissão', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.jpg');
            const res = await request(app)
                .post(`/cursos/${cursoId}/capa/upload`)
                .set('Authorization', `Bearer ${tokenProfessor}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para adicionar capa ao curso!");
        })

        it('Deve retornar erro ao fazer upload de uma imagem de usuário com tipo de arquivo inválido', async () => {
            const caminhoImagem = path.resolve(__dirname, '../images/perfil.txt');
            const res = await request(app)
                .post(`/cursos/${cursoId}/capa/upload`)
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .attach('file', caminhoImagem);

            expect(res.statusCode).toBe(422);
            expect(res.body.errors).toContainEqual("O arquivo enviado não é uma imagem válida, os tipos aceitos são: image/jpeg, image/jpg, image/png, image/webp!");
        })
    });

    describe('/GET em capa de curso', () => {
        it('Deve buscar a capa de um curso', async () => {
            const res = await request(app)
                .get(`/cursos/${cursoId}/capa`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao buscar capa de um curso com ID inválido', async () => {
            const res = await request(app)
                .get('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9/capa')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                message: "Nenhum registro encontrado com este id!",
                path: "cursoid"
            });
        })

        it('Deve retornar erro ao buscar capa de um curso sem imagem', async () => {
            const cursoTesteOneId = (await prisma.curso.create({
                data: {
                    nome: 'Curso Teste One',
                    descricao: 'Descrição do curso teste one',
                    categoria: {
                        connect: { id: categoriaId }
                    }
                }
            }))?.id;

            const res = await request(app)
                .get(`/cursos/${cursoTesteOneId}/capa`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual("Não foi possivel encontrar o arquivo");
        });
    })

    describe('/DELETE em capa de curso', () => {
        it('Deve deletar a capa de um curso', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}/capa/delete`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao deletar a capa de um curso com ID inválido', async () => {
            const res = await request(app)
                .delete('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9/capa/delete')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                message: "Nenhum registro encontrado com este id!",
                path: "cursoid"
            });
        });

        it('Deve retornar erro ao tentar deletar a capa de um curso sem permissão', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}/capa/delete`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para deletar capa do curso!");
        });
    });

    describe('/GET em cursos inscritos por usuário', () => {
        it('Deve listar cursos inscritos por usuário', async () => {
            const res = await request(app)
                .get(`/cursos/inscricoes/usuario/${instrutorId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });

        it('Deve retornar erro ao listar cursos inscritos por usuário com ID inválido', async () => {
            const res = await request(app)
                .get('/cursos/inscricoes/usuario/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.errors).toContainEqual({
                path: "usuarioid",
                message: "Nenhum registro encontrado com este id!"
            });
        });
    });

    describe('/DELETE em cursos', () => {
        it('Deve retornar erro ao tentar deletar um curso sem permissão', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}`)
                .set('Authorization', `Bearer ${tokenProfessor}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body.errors).toContainEqual("Usuário sem permissão para deletar o curso!")
        });

        it('Deve retornar erro ao tentar deletar um curso com ID inválido', async () => {
            const res = await request(app)
                .delete('/cursos/5a602dc4-f642-45d6-a082-8b285b182bb9')
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(422);
            expect(res.body.errors).toContainEqual({
                path: "id",
                message: "Nenhum registro encontrado com este id!",
            });
        });

        it('Deve deletar um curso', async () => {
            const res = await request(app)
                .delete(`/cursos/${cursoId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
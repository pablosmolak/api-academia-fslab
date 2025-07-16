import { sendError, sendResponse, messages } from '../../../src/utils/mensagens.js';
import { jest } from '@jest/globals';

describe('Testes de mensagens', () => {
    describe('Testes da função sendError', () => {
        const mockRes = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };

        it('Deve enviar erro com array de mensagens', () => {
            const res = mockRes();
            const code = 400;
            const errors = ['Campo obrigatório', 'Formato inválido'];

            sendError(res, code, errors);

            expect(res.status).toHaveBeenCalledWith(code);
            expect(res.json).toHaveBeenCalledWith({
                data: [],
                error: true,
                code,
                message: messages.httpCodes[code],
                errors,
            });
        });

        it('Deve enviar erro com string única', () => {
            const res = mockRes();
            const code = 401;
            const errors = 'Não autorizado';

            sendError(res, code, errors);

            expect(res.status).toHaveBeenCalledWith(code);
            expect(res.json).toHaveBeenCalledWith({
                data: [],
                error: true,
                code,
                message: messages.httpCodes[code],
                errors: [errors],
            });
        });
    });

    describe('Testes da função sendResponse', () => {
        const mockRes = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };

        it('Deve enviar resposta com objeto', () => {
            const res = mockRes();
            const code = 200;
            const response = { nome: 'Pablo' };

            sendResponse(res, code, response);

            expect(res.status).toHaveBeenCalledWith(code);
            expect(res.json).toHaveBeenCalledWith({
                data: [response],
                error: false,
                code,
                message: messages.httpCodes[code],
                errors: [],
            });
        });

        it('Deve enviar resposta com array', () => {
            const res = mockRes();
            const code = 201;
            const response = [{ nome: 'Pablo' }, { nome: 'Maria' }];

            sendResponse(res, code, response);

            expect(res.status).toHaveBeenCalledWith(code);
            expect(res.json).toHaveBeenCalledWith({
                data: response,
                error: false,
                code,
                message: messages.httpCodes[code],
                errors: [],
            });
        });

        it('Deve incluir args extras na resposta', () => {
            const res = mockRes();
            const code = 202;
            const response = { valor: 1 };
            const args = { pagination: { total: 10 } };

            sendResponse(res, code, response, args);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                ...args,
            }));
        });
    });

    describe('Testes das mensagens', () => {
        it('Deve retornar mensagem de usuário logado', () => {
            const msg = messages.info.userLoggedIn('Pablo');
            expect(msg).toBe('Usuário Pablo logado com sucesso!');
        });

        it('Deve retornar mensagem de campo obrigatório', () => {
            const msg = messages.validationGeneric.fieldIsRequired('email');
            expect(msg).toBe('O campo email é obrigatório!');
        });

        it('Deve retornar mensagem de recurso não encontrado', () => {
            const msg = messages.error.resourceNotFound('cpf');
            expect(msg).toBe('O campo cpf não foi encontrado!');
        });

        it('Deve retornar mensagem de tamanho mínimo', () => {
            const msg = messages.customValidation.lengthMenor('nome', 3);
            expect(msg).toBe('O campo nome precisa ter no mínimo 3 caracteres!');
        });

        it('Deve retornar mensagem de valores permitidos', () => {
            const valores = { A: 'Ativo', I: 'Inativo' };
            const msg = messages.validationGeneric.mustBeOneOf('status', valores);
            expect(msg).toBe('O campo status deve ser um dos seguintes valores: Ativo, Inativo');
        });
        it('Deve retornar mensagem de campo repetido', () => {
            const msg = messages.validationGeneric.fieldIsRepeated('email');
            expect(msg).toBe('O campo email informado já está cadastrado!');
        });

        it('Deve retornar mensagem de formato inválido para campo', () => {
            const msg = messages.validationGeneric.invalidInputFormatForField('telefone');
            expect(msg).toBe('Formato de entrada inválido para o campo telefone!');
        });

        it('Deve retornar mensagem de recurso em uso', () => {
            const msg = messages.validationGeneric.resourceInUse('usuário');
            expect(msg).toBe('Recurso em uso em usuário!');
        });

        it('Deve retornar mensagem de valor inválido', () => {
            const msg = messages.validationGeneric.invalid('senha');
            expect(msg).toBe('Valor informado em senha é inválido!');
        });

        it('Deve retornar mensagem masculino campo não encontrado', () => {
            const msg = messages.validationGeneric.mascCamp('Registro');
            expect(msg).toBe('Registro não encontrado!');
        });

        it('Deve retornar mensagem feminino campo não encontrada', () => {
            const msg = messages.validationGeneric.femCamp('Usuária');
            expect(msg).toBe('Usuária não encontrada!');
        });

        it('Deve retornar mensagem nenhum registro encontrado', () => {
            const msg = messages.validationGeneric.notFound('ID');
            expect(msg).toBe('Nenhum registro encontrado com este ID!');
        });

        it('Deve retornar mensagem de falha na autenticação', () => {
            expect(messages.auth.authenticationFailed).toBe('Falha na autenticação! Credenciais inválidas!');
        });

        it('Deve retornar mensagem de usuário não encontrado', () => {
            const msg = messages.auth.userNotFound('123abc');
            expect(msg).toBe('Usuário com ID 123abc não encontrado!');
        });

        it('Deve retornar mensagem de permissão inválida', () => {
            expect(messages.auth.invalidPermission).toBe('Permissão insuficiente para executar a operação!');
        });

        it('Deve retornar mensagem de entrada duplicada', () => {
            const msg = messages.auth.duplicateEntry('email');
            expect(msg).toBe('Já existe um registro com o mesmo email!');
        });

        it('Deve retornar mensagem de conta bloqueada', () => {
            expect(messages.auth.accountLocked).toBe('Conta bloqueada! Entre em contato com o suporte!');
        });

        it('Deve retornar mensagem de token inválido', () => {
            expect(messages.auth.invalidToken).toBe('Token inválido!');
        });

        it('Deve retornar mensagem de timeout', () => {
            expect(messages.auth.timeoutError).toBe('Tempo de espera excedido, Tente novamente mais tarde!');
        });

        it('Deve retornar mensagem de erro de conexão com o banco', () => {
            expect(messages.auth.databaseConnectionError).toBe('Erro de conexão com o banco de dados, Tente novamente mais tarde!');
        });

        it('Deve retornar mensagem de email já existente', () => {
            expect(messages.auth.emailAlreadyExists()).toBe('O endereço de e-mail informado já está em uso!');
        });

        it('Deve retornar mensagem de tamanho máximo com plural', () => {
            const msg = messages.customValidation.lengthMaior('nome', 5);
            expect(msg).toBe('O campo nome deve ter no máximo 5 caracteres!');
        });

        it('Deve retornar mensagem de tamanho máximo com singular', () => {
            const msg = messages.customValidation.lengthMaior('idade', 1);
            expect(msg).toBe('O campo idade deve ter no máximo 1 caracter!');
        });

        it('Deve retornar mensagem de tamanho mínimo com plural', () => {
            const msg = messages.customValidation.lengthMenor('senha', 3);
            expect(msg).toBe('O campo senha precisa ter no mínimo 3 caracteres!');
        });

        it('Deve retornar mensagem de tamanho mínimo com singular', () => {
            const msg = messages.customValidation.lengthMenor('idade', 1);
            expect(msg).toBe('O campo idade precisa ter no mínimo 1 caracter!');
        });
    });
});
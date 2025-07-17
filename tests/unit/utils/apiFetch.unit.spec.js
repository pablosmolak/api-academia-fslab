import { jest } from '@jest/globals';
import { apiFetch } from '../../../src/utils/apiFetch.js';
import { APIError } from '../../../src/utils/wrapException.js';

global.fetch = jest.fn();

describe('Testes de apiFetch', () => {
    const urlApi = 'https://fake-api.com';
    const token = 'abc123';
    const nomeApi = 'FS-Mail';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Faz GET com query string corretamente', async () => {
        const body = { nome: 'Pablo', ativo: 'true' };
        const responseData = { error: false };

        fetch.mockResolvedValue({
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve(responseData)
        });

        const res = await apiFetch(nomeApi, urlApi, token, 'GET', '/usuarios', body);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/usuarios?nome=Pablo&ativo=true'),
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }),
                body: undefined
            })
        );

        expect(res).toEqual(responseData);
    });

    it('Faz POST com JSON corretamente', async () => {
        const body = { nome: 'Pablo' };
        const responseData = { error: false };

        fetch.mockResolvedValue({
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve(responseData)
        });

        const res = await apiFetch(nomeApi, urlApi, token, 'POST', '/usuarios', body);

        expect(fetch).toHaveBeenCalledWith(
            `${urlApi}/usuarios`,
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(body),
                headers: expect.objectContaining({ 'Content-Type': 'application/json' })
            })
        );

        expect(res).toEqual(responseData);
    });

    it('Envia dados como x-www-form-urlencoded', async () => {
        const body = { nome: 'Pablo' };
        const responseData = { error: false };

        fetch.mockResolvedValue({
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve(responseData)
        });

        await apiFetch(nomeApi, urlApi, token, 'POST', '/usuarios', body, 'application/x-www-form-urlencoded');

        expect(fetch).toHaveBeenCalledWith(
            `${urlApi}/usuarios`,
            expect.objectContaining({
                body: expect.any(URLSearchParams),
                headers: expect.objectContaining({ 'Content-Type': 'application/x-www-form-urlencoded' })
            })
        );
    });

    it('Envia texto com content-type text/plain', async () => {
        const body = 'conteúdo bruto';
        const responseData = { error: false };

        fetch.mockResolvedValue({
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve(responseData)
        });

        await apiFetch(nomeApi, urlApi, token, 'PUT', '/raw', body, 'text/plain');

        expect(fetch).toHaveBeenCalledWith(
            `${urlApi}/raw`,
            expect.objectContaining({
                method: 'PUT',
                body,
                headers: expect.objectContaining({ 'Content-Type': 'text/plain' })
            })
        );
    });

    it('Lança APIError com array de erros', async () => {
        const responseErro = {
            error: true,
            errors: ['campo nome obrigatório'],
            code: 422
        };

        fetch.mockResolvedValue({
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve(responseErro)
        });

        try {
            await apiFetch(nomeApi, urlApi, token, 'POST', '/usuarios', {});
            throw new Error('Deveria ter lançado APIError');
        } catch (error) {
            expect(error).toBeInstanceOf(APIError);
            expect(error.code).toBe(422);
            expect(error.errors).toContain('campo nome obrigatório');
        }
    });

    it('Lança erro genérico se fetch falhar', async () => {
        fetch.mockRejectedValue(new Error('falha de rede'));

        await expect(apiFetch(nomeApi, urlApi, token, 'POST', '/usuarios', {}))
            .rejects.toThrow('Erro ao fazer requisição para a API FS-Mail');
    });
});
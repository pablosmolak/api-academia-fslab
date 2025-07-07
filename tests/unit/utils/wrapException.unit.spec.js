// wrapException.unit.spec.js
import { jest } from '@jest/globals';

const sendError = jest.fn();

// mocka ESM corretamente
jest.unstable_mockModule('../../../src/utils/mensagens.js', () => ({
    sendError,
    default: { sendError }
}));

const { wrapException, APIError } = await import('../../../src/utils/wrapException.js');
const { ZodError } = await import('zod');

describe('wrapException', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {};
        next = jest.fn();
        sendError.mockClear();
        process.env.DEBUGLOG = "true";
    });

    it('deve chamar função normalmente sem erro', async () => {
        const fn = jest.fn().mockResolvedValue('ok');
        const middleware = wrapException(fn);

        const result = await middleware(req, res, next);
        expect(fn).toHaveBeenCalledWith(req, res, next);
        expect(result).toBe('ok');
        expect(sendError).not.toHaveBeenCalled();
    });

    it('deve capturar APIError e chamar sendError com código e erros', async () => {
        const apiError = new APIError([{ message: 'Erro API' }], 401);
        const fn = jest.fn().mockRejectedValue(apiError);
        const middleware = wrapException(fn);

        await middleware(req, res, next);

        expect(sendError).toHaveBeenCalledWith(res, 401, apiError.errors);
    });

    it('deve capturar ZodError e chamar sendError com erros formatados', async () => {
        const zodError = new ZodError([
            { message: 'Erro 1', path: ['campo1'] },
            { message: 'Erro 2', path: ['campo2', 'subcampo'] },
        ]);
        const fn = jest.fn().mockRejectedValue(zodError);
        const middleware = wrapException(fn);

        await middleware(req, res, next);

        expect(sendError).toHaveBeenCalledWith(res, 422, [
            { message: 'Erro 1', path: 'campo1' },
            { message: 'Erro 2', path: 'campo2.subcampo' },
        ]);
    });

    it('deve capturar erro desconhecido e chamar sendError com código 500', async () => {
        const error = new Error('Erro desconhecido');
        const fn = jest.fn().mockRejectedValue(error);
        const middleware = wrapException(fn);

        await middleware(req, res, next);

        expect(sendError).toHaveBeenCalledWith(res, 500, [error.message]);
    });
});

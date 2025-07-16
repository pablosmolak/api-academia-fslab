import { jest } from '@jest/globals';
const mockApiFetch = jest.fn();

jest.unstable_mockModule('../../../src/utils/apiFetch.js', () => ({
    apiFetch: mockApiFetch,
}));

const OLD_ENV = process.env;

const { EmailService } = await import('../../../src/services/EmailService.js');

beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
        ...OLD_ENV,
        FS_MAIL_API_URL: 'https://fake-mail-api.com',
        FS_MAIL_API_KEY: 'fake-api-key',
        FS_MAIL_ADDRESS: 'noreply@example.com',
        DEBUGLOG: 'true',
    };
});

afterAll(() => {
    process.env = OLD_ENV;
});

describe('Testes do email service', () => {
    describe('Testes da função sendEmail', () => {
        it('Deve retornar erro de falta de dados obrigatórios', async () => {
            const options = { subject: 'Assunto', to: 'user@example.com' };

            await expect(EmailService.sendEmail(options)).rejects.toThrow(
                'TENTOU ENVIAR E-MAIL, MAS FALTAM DADOS'
            );
        });

        it('Deve testar o envio correto de email com apiFetch', async () => {
            const mockResponse = { status: 'ok' };
            mockApiFetch.mockResolvedValue(mockResponse);
            console.log = jest.fn();

            const options = {
                subject: 'Assunto',
                to: 'user@example.com',
                template: 'welcome',
                data: { nome: 'Fulano' }
            };

            const response = await EmailService.sendEmail(options);

            expect(mockApiFetch).toHaveBeenCalledWith(
                'FS-Mail',
                'https://fake-mail-api.com',
                'fake-api-key',
                'POST',
                '/emails',
                {
                    subject: 'Assunto',
                    from: 'noreply@example.com',
                    to: ['user@example.com'],
                    cc: undefined,
                    bcc: undefined,
                    template: 'welcome',
                    data: { nome: 'Fulano' },
                    track_links: true
                }
            );

            expect(response).toEqual(mockResponse);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('E-mail enviando...'), expect.any(String));
            expect(console.log).toHaveBeenCalledWith('E-mail enviado:', { status: 'ok' });
        });

        it('Deve retornar erro de variáveis de ambiente não configuradas', async () => {
            delete process.env.FS_MAIL_API_KEY;
            console.error = jest.fn();

            const options = {
                subject: 'Erro',
                to: 'user@example.com',
                template: 'errado',
                data: {}
            };

            await EmailService.sendEmail(options);

            expect(console.error).toHaveBeenCalledWith(
                'TENTOU ENVIAR E-MAIL, MAS NÃO ESTÁ CONFIGURADO: ',
                expect.objectContaining({ subject: 'Erro' })
            );
            expect(mockApiFetch).not.toHaveBeenCalled();
        });
    });

    describe('Testes da função cadastrarTemplate', () => {
        it('Deve testar a criação corretamente com apiFetch', async () => {
            const nome = 'welcome';
            const conteudo = '<mjml>template aqui</mjml>';
            const mockResponse = { status: 'ok' };
            
            console.log = jest.fn();
            mockApiFetch.mockResolvedValue(mockResponse);

            const response = await EmailService.cadastrarTemplate(nome, conteudo);

            expect(mockApiFetch).toHaveBeenCalledWith(
                "FS-Mail",
                'https://fake-mail-api.com',
                'fake-api-key',
                "PUT",
                `/templates/${nome}/?format=MJML`,
                conteudo,
                "text/plain"
            );

            expect(response).toEqual(mockResponse);
             expect(console.log).toHaveBeenCalledWith('Template cadastrado:', mockResponse);
        });
    });
});
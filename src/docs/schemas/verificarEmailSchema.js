export const VerificarEmailSchemas = {
    VerificarEmailRequestBody: {
        type: 'object',
        properties: {
            codigoVerificacaoEmail: { 
                type: 'string',
                description: "Código de verificação do e-mail, com exatamente 6 dígitos",
                example: 123456
            }
        },
        required: ['codigoVerificacaoEmail'],
        description: "Corpo da requisição para verificar o código de verificação do e-mail"
    }
}

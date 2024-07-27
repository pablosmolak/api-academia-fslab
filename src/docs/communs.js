import messages from "../utils/mensagens.js";

const messagensDeErro = {
    401: "Permissão insuficiente para executar a operação!",
    422: "O ID informado deve estar em um formato válido (16 bytes)!",
    498: "Token inválido!",
    500: "grupoId is not defined"
}

export const gerarRespostasCorretas = (codigo, schemaRef, isNull = false) => {
    return {
        [codigo]: {
            description: messages.httpCodes[codigo],
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: isNull ? {
                                type: "string",
                                example: []
                            } : {
                                type: "array",
                                items: {
                                    $ref: schemaRef
                                }
                            },
                            error: {
                                type: "boolean",
                                example: false
                            },
                            code: {
                                type: "integer",
                                example: codigo
                            },
                            messages: {
                                type: "string",
                                example: messages.httpCodes[codigo]
                            },
                            errors: {
                                type: "string",
                                example: []
                            }
                        }
                    }
                }
            }
        }
    }
}

export const gerarRespostasDeErro = (codes) => {
    return Object.fromEntries(
        codes.map(code => [
            code,
            {
                description: messages.httpCodes[code],
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                data: {
                                    type: "string",
                                    example: []
                                },
                                error: {
                                    type: "boolean",
                                    example: true
                                },
                                code: {
                                    type: "integer",
                                    example: code
                                },
                                messages: {
                                    type: "string",
                                    example: messages.httpCodes[code]
                                },
                                errors: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        example: messagensDeErro[code]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ])
    );
};

import { z, ZodIssueCode } from "zod";
import { applyZodInitialConfig, myZ, traduzirMensagemZod } from "../../../src/utils/zod";

// Configura tradução global de mensagens de erro do Zod
beforeAll(() => {
    applyZodInitialConfig();
});

describe('Testes do MyZod', () => {

    describe("myZ.strToInt", () => {
        const schema = myZ.strToInt();

        it("Deve validar número inteiro válido como string", () => {
            const result = schema.parse("123");
            expect(result).toBe(123);
        });

        it("Deve retornar erro para número decimal", () => {
            const result = () => schema.parse("12.3");
            expect(result).toThrow("Número inteiro inválido");
        });
    })

    describe("myZ.toDateTime", () => {
        const schema = myZ.toDateTime();

        it("Deve validar uma string ISO válida e retornar um objeto Date", () => {
            const result = schema.parse("2025-07-03T15:30:00");

            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toContain("2025-07-03T");
        });

        it("Deve retornar erro se a string não estiver no formato ISO válido", () => {
            const result = () => schema.parse("03/07/2025 15:30");

            expect(result).toThrow("Formato de data inválido");
        });
    });

    describe("myZ.toUTCDate", () => {
        const schema = myZ.toUTCDate();

        it("Deve validar uma data no formato YYYY-MM-DD e retornar um Date", () => {
            const result = schema.parse("2025-07-03");

            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString().startsWith("2025-07-03")).toBe(true);
        });

        it("Deve retornar erro com formato de data inválido (dd/mm/yyyy)", () => {
            const result = () => schema.parse("03/07/2025");

            expect(result).toThrow("Formato de data inválido");
        });
    });

    describe("myZ.CPF", () => {
        const schema = myZ.CPF();

        it("Deve validar CPF válido", () => {
            const result = schema.parse("45788733073");

            expect(result).toBe("45788733073");
        })

        it("Deve retornar erro ao informar CPF inválido", () => {
            const result = () => schema.parse("00000000000");

            expect(result).toThrow("CPF inválido");
        });
    });

    describe("myZ.CNPJ", () => {
        const schema = myZ.CNPJ();

        it("Deve validar CNPJ válido", () => {
            const result = schema.parse("12524748000172");

            expect(result).toBe("12524748000172");
        });

        it("Deve retornar erro ao informar CNPJ inválido", () => {
            const result = () => schema.parse("00000000000000");

            expect(result).toThrow("CNPJ inválido");
        });
    });

    describe("myZ.CNH", () => {
        const schema = myZ.CNH();

        it("Deve validar uma CNH válida", () => {
            const result = schema.parse("12345678900");

            expect(result).toBe("12345678900");
        });

        it("Deve retornar erro ao informar CNH inválida", () => {
            const result = () => schema.parse("00000000000");

            expect(result).toThrow("CNH inválida");
        });
    });

    describe("myZ.CEP", () => {
        const schema = myZ.CEP();

        it("Deve validar CEP com 8 dígitos numéricos", () => {
            const result = schema.parse("12345678");

            expect(result).toBe("12345678");
        });

        it("Deve retornar erro ao informar CEP com menos de 8 dígitos", () => {
            const result = () => schema.parse('11545')

            expect(result).toThrow("CEP inválido");
        });
    });

    describe("myZ.senha", () => {
        const schema = myZ.senha();

        it("Deve validar senha válida com todos os requisitos", () => {
            const result = schema.parse("Abcdef1!")

            expect(result).toBe("Abcdef1!");
        });

        it("Deve retornar erro ao informar senha inválida", () => {
            const result = () => schema.parse('125ed');

            expect(result).toThrow(
                "Mínimo 8 caracteres, com 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial."
            );
        });
    });

    describe("myZ.strToFloat", () => {
        const schema = myZ.strToFloat();

        it("Deve validar número decimal válido", () => {
            const result = schema.parse("12.34");

            expect(result).toBeCloseTo(12.34);
        });

        it("Deve retornar erro para string inválida", () => {
            const result = () => schema.parse("abc");

            expect(result).toThrow("Número com casas decimais inválido");
        });
    });

    describe("myZ.strToBoolean", () => {
        const schema = myZ.strToBoolean();

        it("Deve transformar 'true' em booleano true", () => {
            const result = schema.parse("true");

            expect(result).toBe(true);
        });

        it("Deve retornar erro para qualquer outro valor", () => {
            const result = () => schema.parse("sim");

            expect(result).toThrow("Valor booleano inválido");
        });
    });

    describe("myZ.email", () => {
        const schema = myZ.email();

        it("Deve validar um email", () => {
            const result = schema.parse("teste@example.com")

            expect(result).toBe("teste@example.com");
        });

        it("Deve retornar erro para email inválido", () => {
            const result = () => schema.parse("teste@")

            expect(result).toThrow("Email no formato inválido!")
        });
    });

    describe("myZ.emptyToNull", () => {
        const schema = myZ.emptyToNull(z.string().min(1))

        it("Deve converter string vazia para null", () => {
            const result = schema.parse("");
            expect(result).toBeNull();
        });

        it("Deve aceitar string válida", () => {
            const result = schema.parse("abc");

            expect(result).toBe("abc");
        });
    })

    describe("myZ.cargaHoraria", () => {
        const schema = myZ.cargaHoraria()

        it("Deve validar carga horária válida no formato HH:MM:SS", () => {
            const result = schema.parse("08:30:15");

            expect(result).toBe("08:30:15");
        });


        it("Deve retornar erro ao informar hora inválida", () => {
            const result = () => schema.parse("10-00-00");

            expect(result).toThrow("Formato inválido de carga horária, o formato correto é: 'HH:MM:SS'");
        });
    });
});

describe('Testes de tradução do zod', () => {
    describe("Deve traduzir erro de tipo inválido", () => {
        const casos = [
            { expected: "string", received: "number", esperado: "Tipo inválido, deveria ser texto mas recebeu número" },
            { expected: "nan", received: "string", esperado: "Tipo inválido, deveria ser número inválido mas recebeu texto" },
            { expected: "number", received: "boolean", esperado: "Tipo inválido, deveria ser número mas recebeu verdadeiro ou falso" },
            { expected: "integer", received: "float", esperado: "Tipo inválido, deveria ser inteiro mas recebeu número com casas decimais" },
            { expected: "float", received: "integer", esperado: "Tipo inválido, deveria ser número com casas decimais mas recebeu inteiro" },
            { expected: "boolean", received: "object", esperado: "Tipo inválido, deveria ser verdadeiro ou falso mas recebeu objeto" },
            { expected: "date", received: "string", esperado: "Tipo inválido, deveria ser data mas recebeu texto" },
            { expected: "bigint", received: "number", esperado: "Tipo inválido, deveria ser número grande mas recebeu número" },
            { expected: "symbol", received: "string", esperado: "Tipo inválido, deveria ser símbolo mas recebeu texto" },
            { expected: "function", received: "função", esperado: "Tipo inválido, deveria ser função mas recebeu função" },
            { expected: "undefined", received: "nada", esperado: "Tipo inválido, deveria ser nada mas recebeu nada" },
            { expected: "null", received: "nulo", esperado: "Tipo inválido, deveria ser nulo mas recebeu nulo" },
            { expected: "array", received: "object", esperado: "Tipo inválido, deveria ser array mas recebeu objeto" },
            { expected: "object", received: "array", esperado: "Tipo inválido, deveria ser objeto mas recebeu array" },
            { expected: "unknown", received: "string", esperado: "Tipo inválido, deveria ser desconhecido mas recebeu texto" },
            { expected: "promise", received: "object", esperado: "Tipo inválido, deveria ser promessa mas recebeu objeto" },
            { expected: "void", received: "number", esperado: "Tipo inválido, deveria ser vazio mas recebeu número" },
            { expected: "never", received: "string", esperado: "Tipo inválido, deveria ser nunca mas recebeu texto" },
            { expected: "map", received: "object", esperado: "Tipo inválido, deveria ser mapa mas recebeu objeto" },
            { expected: "set", received: "array", esperado: "Tipo inválido, deveria ser conjunto mas recebeu array" },
        ];

        it.each(casos)(
            "Deve traduzir de $expected para $received corretamente",
            ({ expected, received, esperado }) => {
                const message = traduzirMensagemZod({
                    code: ZodIssueCode.invalid_type,
                    expected,
                    received,
                    path: ["campoTeste"],
                    message: ""
                });
                expect(message).toBe(esperado);
            }
        );
    });

    it("Deve traduzir erro de tipo undefined como campo obrigatório", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_type,
            expected: "string",
            received: "undefined",
            path: ["campoObrigatorio"],
            message: ""
        });
        expect(message).toBe("Este campo é obrigatório");
    });

    it("Deve traduzir erro de string inválida com UUID", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_string,
            validation: "uuid",
            path: ["id"],
            message: ""
        });
        expect(message).toContain("UUID em formato inválido");
    });

    it("Deve traduzir erro de string inválida", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_string,
            validation: "string",
            path: ["id"],
            message: ""
        });
        expect(message).toContain("Formato de string inválido, string");
    });

    it("Deve traduzir erro de literal inválido", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_literal,
            expected: "ativo",
            path: ["status"],
            message: ""
        });
        expect(message).toBe("Literal inválido, deveria ser ativo");
    });

    it("Deve traduzir erro customizado", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.custom,
            path: ["campoCustom"],
            message: "",
            params: { info: "Erro customizado" }
        });
        expect(message).toBe('Erro Desconhecido: {"info":"Erro customizado"}');
    });

    it("Deve traduzir erro de união inválida", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_union,
            unionErrors: [{}, {}, {}], // simula 3 opções
            path: ["campoUnion"],
            message: ""
        });
        expect(message).toBe("Não é nenhuma das 3 possibilidades de forma válida");
    });

    it("Deve traduzir erro de discriminador de união inválido", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_union_discriminator,
            options: ["admin", "user"],
            path: ["tipo"],
            message: ""
        });
        expect(message).toBe("Deveria ser um desses: admin, user");
    });

    it("Deve traduzir erro de enum inválido", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_enum_value,
            options: ["A", "B", "C"],
            path: ["letra"],
            message: ""
        });
        expect(message).toBe("Deve ser um desses: A, B, C");
    });

    it("Deve traduzir erro de chaves não reconhecidas", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.unrecognized_keys,
            keys: ["senhaExtra", "tokenSecreto"],
            path: [],
            message: ""
        });
        expect(message).toBe("Não esperava estas chaves: senhaExtra, tokenSecreto");
    });

    it("Deve traduzir erro de chaves não reconhecidas", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.unrecognized_keys,
            keys: ["senhaExtra", "tokenSecreto"],
            path: [],
            message: ""
        });
        expect(message).toBe("Não esperava estas chaves: senhaExtra, tokenSecreto");
    });

    it("Deve traduzir erro de argumentos inválidos", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_arguments,
            argumentsError: { message: "Argumento malformado" },
            path: [],
            message: ""
        });
        expect(message).toBe("Argumentos inválidos: Argumento malformado");
    });

    it("Deve traduzir erro de tipo de retorno inválido", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_return_type,
            returnTypeError: { message: "Esperava string, recebeu number" },
            path: [],
            message: ""
        });
        expect(message).toBe("Tipo de retorno inválido Esperava string, recebeu number");
    });

    it("Deve traduzir erro de data inválida", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_date,
            path: ["nascimento"],
            message: ""
        });
        expect(message).toBe("Formato de data inválido.");
    });

    it("Deve traduzir erro de número muito pequeno", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_small,
            type: "number",
            minimum: 10,
            inclusive: true,
            path: ["idade"],
            message: ""
        });
        expect(message).toBe("O campo idade deve ser no mínimo 10");
    });

    it("Deve traduzir erro de string muito curta", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_small,
            type: "string",
            minimum: 5,
            inclusive: true,
            path: ["nome"],
            message: ""
        });
        expect(message).toBe("O campo nome deve ter no mínimo 5 caracteres");
    });

    it("Deve traduzir erro de data muito antiga", () => {
        const dataMinima = new Date("2025-01-01").getTime();
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_small,
            type: "date",
            minimum: dataMinima,
            inclusive: false,
            path: ["inicio"],
            message: ""
        });

        expect(message).toBe(`O campo inicio deve ser após ${new Date(dataMinima).toLocaleDateString()}`);
    });

    it("Deve traduzir erro de quantidade mínima de elementos", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_small,
            type: "array",
            minimum: 3,
            inclusive: true,
            path: ["itens"],
            message: ""
        });

        expect(message).toBe("O campo itens deve ter no mínimo 3 elementos");
    });

    it("Deve traduzir erro de string muito longa", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_big,
            type: "string",
            maximum: 10,
            inclusive: true,
            path: ["nomeCompleto"],
            message: ""
        });
        expect(message).toBe("Deve ter no máximo 10 caracteres");
    });

    it("Deve traduzir erro de número muito grande", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_big,
            type: "number",
            maximum: 100,
            inclusive: true,
            path: ["valor"],
            message: ""
        });

        expect(message).toBe("Deve ser no máximo 100");
    });

    it("Deve traduzir erro de bigint muito grande", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: 9007199254740991n,
            inclusive: true,
            path: ["idGrande"],
            message: ""
        });

        expect(message).toBe("Deve ser no máximo 9007199254740991");
    });

    it("Deve traduzir erro de data muito futura", () => {
        const dataMaxima = new Date("2025-12-31").getTime();

        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_big,
            type: "date",
            maximum: dataMaxima,
            inclusive: false,
            path: ["fim"],
            message: ""
        });

        expect(message).toBe(`Deve ser antes de ${new Date(dataMaxima).toLocaleDateString()}`);
    });

    it("Deve traduzir erro de quantidade máxima de elementos", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.too_big,
            type: "array",
            maximum: 10,
            inclusive: true,
            path: ["itens"],
            message: ""
        });

        expect(message).toBe("Deve ter no máximo 10 elementos");
    });

    it("Deve traduzir erro de tipos de interseção inválidos", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.invalid_intersection_types,
            path: ["intersecao"],
            message: ""
        });
        expect(message).toBe("Tipos de interseção inválidos");
    });

    it("Deve traduzir erro de valor não múltiplo", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.not_multiple_of,
            multipleOf: 5,
            path: ["quantidade"],
            message: ""
        });
        expect(message).toBe("O valor não é múltiplo de 5");
    });

    it("Deve traduzir erro de valor não finito", () => {
        const message = traduzirMensagemZod({
            code: ZodIssueCode.not_finite,
            path: ["valor"],
            message: ""
        });
        expect(message).toBe("O valor não é finito");
    });

    it("Deve retornar a mensagem padrão fornecida pelo Zod (default com message)", () => {
        const message = traduzirMensagemZod({
            code: "algum_codigo_inesperado",
            path: ["campoDesconhecido"],
            message: "Mensagem personalizada do Zod"
        });

        expect(message).toBe("Mensagem personalizada do Zod");
    });

    it("Deve aplicar mensagem customizada com z.setErrorMap", () => {
        const schema = z.object({
            nome: z.string()
        });

        const resultado = schema.safeParse({ nome: 123 });

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            const mensagemErro = resultado.error.errors[0].message;
            expect(mensagemErro).toBe("Tipo inválido, deveria ser texto mas recebeu número");
        }
    });
});
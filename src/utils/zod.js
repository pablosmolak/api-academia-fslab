import { ZodIssueCode, z } from "zod"
import { isCPF, isCNPJ, isCNH } from "validation-br"


export const myZ = {
    strToInt: () => z.string()
        .regex(/^-?[0-9]+$/, "Número inteiro inválido")
        .transform((str) => parseInt(str, 10)),

    strToFloat: () => z.string()
        .regex(/^[+-]?[0-9]+(\.[0-9]+)?$/, "Número com casas decimais inválido")
        .transform((str) => parseFloat(str)),

    toDateTime: () => z.string()
        .datetime({ message: "Formato de data inválido", local: true })
        .transform((str) => new Date(str)),

    toUTCDate: () => z.string()
        .date("Formato de data inválido")
        .transform((str) => new Date(str)),

    strToBoolean: () => z.string()
        .refine((str) => str === "true" || str === "false", "Valor booleano inválido")
        .transform((str) => str === "true"),
    CPF: () => z.string()
        .refine((cpf) => isCPF(cpf), "CPF inválido"),

    CNPJ: () => z.string()
        .refine((cnpj) => isCNPJ(cnpj), "CNPJ inválido"),

    CNH: () => z.string()
        .refine((cnh) => isCNH(cnh), "CNH inválida"),

    CEP: () => z.string()
        .regex(/^\d{8}$/, "CEP inválido"),

    email: () => z.string()
        .regex(/^(?!.*\s)(?!.*\.{2})(?!.*@$)(?!^\.)(?!.*@\.$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
            "Email no formato inválido!"),

    senha: () => z.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=:;,.<>?/~`|\\[\]{}]).{8,}$/,
            "A senha deve conter no mínimo 8 caracteres, incluindo ao menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial."),

    cargaHoraria: () => z.string()
        .regex(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
            "Formato inválido de carga horária, o formato correto é: 'HH:MM:SS'"),


    estado: () => z.string()
        .regex(/^[A-Z]{2}$/, "A sigla deve conter apenas letras maiúsculas"),

    /** Se passar uma string vazia, vira um valor nulo
     * Mas também pode mandar nulo se quiser
     * 
     * Obs: Necessário enviar o schema como argumento
     * 
     * ```
     * myZ.emptyToNull(z.string().min(1)).optional()
     * ```
     */
    emptyToNull: (schema) => z.preprocess((str) => {
        if (str === "") return null
        else return str
    }, schema.nullable())
}

export const commonZodSchemas = {
    getPorSigla: () => z.object({
        sigla: myZ.estado()
    }),
}

function traduzirNomeTipo(tipo) {
    switch (tipo) {
        case "string": return "texto"
        case "nan": return "número inválido"
        case "number": return "número"
        case "integer": return "inteiro"
        case "float": return "número com casas decimais"
        case "boolean": return "verdadeiro ou falso"
        case "date": return "data"
        case "bigint": return "número grande"
        case "symbol": return "símbolo"
        case "function": return "função"
        case "undefined": return "nada"
        case "null": return "nulo"
        case "array": return "array"
        case "object": return "objeto"
        case "unknown": return "desconhecido"
        case "promise": return "promessa"
        case "void": return "vazio"
        case "never": return "nunca"
        case "map": return "mapa"
        case "set": return "conjunto"
        default:
            return tipo
    }
}

/**
 * 
 * @param {ZodIssueOptionalMessage} issue
 */
export const traduzirMensagemZod = (issue) => {
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === "undefined" || issue.received === "null") {
                return `O campo ${issue.path.join(".")} é obrigatório`
            }
            return `O campo ${issue.path.join(".")} recebeu um Tipo inválido, deveria ser ${traduzirNomeTipo(issue.expected)} mas recebeu ${traduzirNomeTipo(issue.received)}`
        case ZodIssueCode.invalid_literal:
            return `Literal inválido, deveria ser ${issue.expected}`
        case ZodIssueCode.custom:
            return `Erro Desconhecido: ${JSON.stringify(issue.params)}`
        case ZodIssueCode.invalid_union:
            return `Não é nenhuma das ${issue.unionErrors.length} possibilidades de forma válida`
        case ZodIssueCode.invalid_union_discriminator:
            return `Deveria ser um desses: ${issue.options?.join(", ")}`
        case ZodIssueCode.invalid_enum_value:
            return `O campo ${issue.path.join(".")} deve conter algum desses valores: ${issue.options?.join(", ")}`
        case ZodIssueCode.unrecognized_keys:
            return `Não esperava estas chaves: ${issue.keys?.join(", ")}`
        case ZodIssueCode.invalid_arguments:
            return `Argumentos inválidos: ${issue.argumentsError.message}`
        case ZodIssueCode.invalid_return_type:
            return `Tipo de retorno inválido ${issue.returnTypeError.message}`
        case ZodIssueCode.invalid_date:
            return "Formato de data inválido."
        case ZodIssueCode.invalid_string:
            if (issue.validation === "uuid") {
                return `No campo ${issue.path.join(" na posição ")} contém um UUID em formato inválido!`
            } else {
                return `Formato de string inválido, ${issue.validation}`
            }
        case ZodIssueCode.too_small:
            if (issue.type === "number" || issue.type === "bigint")
                return `O campo ${issue.path.join(".")} deve ser no mínimo ${issue.minimum}`
            else if (issue.type === "string")
                return `O campo ${issue.path.join(".")} deve ter no mínimo ${issue.minimum} caracteres`
            else if (issue.type === "date")
                return `O campo ${issue.path.join(".")} deve ser após ${new Date(issue.minimum).toLocaleDateString()}`;
            else
                return `O campo ${issue.path.join(".")} deve ter no mínimo ${issue.minimum} elementos`;
        case ZodIssueCode.too_big:
            if (issue.type === "number" || issue.type === "bigint")
                return `Deve ser no máximo ${issue.maximum}`;
            else if (issue.type === "string")
                return `Deve ter no máximo ${issue.maximum} caracteres`;
            else if (issue.type === "date")
                return `Deve ser antes de ${new Date(issue.maximum).toLocaleDateString()}`;
            else
                return `Deve ter no máximo ${issue.maximum} elementos`;
        case ZodIssueCode.invalid_intersection_types:
            return "Tipos de interseção inválidos";
        case ZodIssueCode.not_multiple_of:
            return `O valor não é múltiplo de ${issue.multipleOf}`;
        case ZodIssueCode.not_finite:
            return "O valor não é finito";
        default:
            return issue.message ?? `Erro Desconhecido: ${JSON.stringify(issue)}`
    }
}

// https://zod.dev/ERROR_HANDLING
export const applyZodInitialConfig = () => {
    z.setErrorMap((issue, ctx) => {
        return {
            message: traduzirMensagemZod(issue)
        }
    })
}

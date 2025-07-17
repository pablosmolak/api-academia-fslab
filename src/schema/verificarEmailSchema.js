import { z } from "zod";

export class verificarEmailSchema {
    static verificarEmail = z.object({
        codigoVerificacaoEmail: z
            .string()
            .refine(value => value.toString().length === 6, {
                message: "O código de verificação deve ter exatamente 6 dígitos.",
            }),
    });
}

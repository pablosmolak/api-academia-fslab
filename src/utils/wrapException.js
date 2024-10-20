import { ZodError } from "zod";
import messages, { sendError } from "./mensagens.js"

export class APIError extends Error {
    constructor(errors, code = 400, options = undefined) {
        super(errors? errors[0]?.message : "Erro com código " + code, options);
        this.code = errors?.code || code;
        this.errors = errors;
    }
}

export const wrapException = (fn) => {
    return async (req, res, next) => {
        // Medir o tempo que levou para executar

        if (process.env.DEBUGLOG === "true") {
            console.time("Tempo de execução")
        }

        try {
            return await fn(req, res, next)
        }
        catch (err) {
            if (process.env.DEBUGLOG === "true") console.error(err)

                if (err instanceof APIError) {
                    // Erro retornado da API de autenticação
                    return sendError(res, err.code, err.errors || err.message);
                } else if (err instanceof ZodError) {
                    // Erro de validação do Zod
                    let errors = [];
                    for(const issue of err.issues) {
                        errors.push({
                            message: issue.message,
                            path: issue.path.join(".")
                        });
                    }
    
                    return sendError(res, 422, errors);
                } else {
                    // Erro desconhecido
                    console.error(err);
                    return sendError(res, 500, [err.message || "" + err ]);
                }

        } finally {
            if (process.env.DEBUGLOG === "true") {
               console.timeEnd("Tempo de execução")
            }
        }
    }
}
import messages, { sendError } from "./mensagens.js"

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

            return sendError(res, 500, err.message || "" + err )

        } finally {
            if (process.env.DEBUGLOG === "true") {
               console.timeEnd("Tempo de execução")
            }
        }
    }
}
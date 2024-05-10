import messages, { sendError } from "./mensagens.js"

export const wrapException = (fn) => {
    return async (req, res, next) => {
        // Medir o tempo que levou para executar
        let tempoInicio

        if (process.env.DEBUGLOG === "true") {
            tempoInicio = performance.now()
        }

        try {
            return await fn(req, res, next)
        }
        catch (err) {
            if (process.env.DEBUGLOG === "true") console.error(err)

            return sendError(res, 500, err.message || "" + err )

        } finally {
            // Medir o tempo que levou para executar
            if (process.env.DEBUGLOG === "true") {
                const millis = parseInt(performance.now() - tempoInicio)
                console.log(`Tempo de execução: ${millis}ms`)
            }
        }
    }
}
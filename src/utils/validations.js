import messages from "./mensagens.js"

export function validarEmail(email, erros) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(email)) {
        erros.push(messages.customValidation.invalidMail)
        return false
    }

    if (email.includes(" ")) {
        erros.push(messages.customValidation.invalidMail)
        return false
    }

    const [parteLocal, parteDominio] = email.split('@')
    if (parteLocal.startsWith('.') || parteLocal.endsWith('.') ||
        parteDominio.startsWith('.') || parteDominio.endsWith('.')) {

        erros.push(messages.customValidation.invalidMail)
        return false
    }

    if (parteDominio.includes('..')) {
        erros.push(messages.customValidation.invalidMail)
        return false
    }

    return true
}
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

export function validarSenha(senha,erros) {
    const maisculas = /[A-Z]/
    const minusculas = /[a-z]/
    const numeros = /[0-9]/
    const especial = /[!@#$%^&*()_\-+=:;,.<>?/~`|\\[\]{}]/

    if (senha.length < 8) {
        erros.push("A senha deve conter no mínimo 8 caracteres!")
    }

    if (!maisculas.test(senha)) {
        erros.push("A senha precisa conter ao menos 1 letra maiúscula!")
    }

    if (!minusculas.test(senha)) {
        erros.push("A senha precisa conter ao menos 1 letra minúscula!")
    }

    if (!numeros.test(senha)) {
        erros.push("A senha precisa conter ao menos 1 número!")
    }

    if (!especial.test(senha)) {
        erros.push("A senha deve conter ao menos 1 caractere especial!")
    }

    return
}

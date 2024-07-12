import { HttpException, Injectable } from '@nestjs/common'
import { messages } from './mensagens'
import { SendRespostaDTO } from './Respostas.dto'

@Injectable()
export class UtilsService {

    respostaPadrao(code: number, data: Record<string, any>[]): SendRespostaDTO {
        return {
            data: data,
            error: false,
            code: code,
            message: messages.httpCodes[code],
            errors: []
        }
    }

    respostaErro(code: number, data: Record<string, any>[], errors: string[]): SendRespostaDTO {
        throw new HttpException(
            {
                data: data,
                error: true,
                code: code,
                message: messages.httpCodes[code],
                errors: errors
            },
            code
        )
    }

    validarSenha(senha: string, erros: string[]): void{
        const maisculas: RegExp = /[A-Z]/
        const minusculas: RegExp = /[a-z]/
        const numeros: RegExp = /[0-9]/
        const especial: RegExp = /[!@#$%^&*()_\-+=:;,.<>?/~`|\\[\]{}]/

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

    validarEmail(email: string, erros: string[]): boolean {
        
        const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

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
}
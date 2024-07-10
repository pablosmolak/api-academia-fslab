export class SendRespostaDTO {
    data: Record<string, any>[]
    error: boolean
    code: number
    message: string
    errors: string[]
}
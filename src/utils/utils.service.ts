import { HttpException, Injectable } from '@nestjs/common'
import { messages } from './mensagens';
import { SendRespostaDTO } from './Respostas.dto';

@Injectable()
export class UtilsService {

    respostaPadrao(code: number, data: Record<string, any>[], errors: string[]): SendRespostaDTO {
        return {
            data: data,
            error: false,
            code: code,
            message: messages.httpCodes[code],
            errors: errors
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
}


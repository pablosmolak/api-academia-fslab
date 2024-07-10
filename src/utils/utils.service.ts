import { Injectable } from '@nestjs/common'
import { messages } from './mensagens';
import { SendRespostaDTO } from './Respostas.dto';

@Injectable()
export class UtilsService {

    respostaPadrao(code: number, data: Record<string, any>[], errors: string[]): SendRespostaDTO {
        return {
            data: data,
            error: errors.length > 0 ? true : false,
            code: code,
            message: messages.httpCodes[code],
            errors: errors
        }
    }
}


import { Injectable } from '@nestjs/common'
import { messages } from './mensagens';
import { SendRespostaDTO } from './Respostas.dto';

@Injectable()
export class UtilsService {

    respostaPadrao(code: number, resp): SendRespostaDTO {
        let _data = undefined;
        if (Array.isArray(resp)) {
            _data = resp
        } else {
            _data = [resp]
        }

        return {
            data: _data,
            error: false,
            code: code,
            message: messages.httpCodes[code],
            errors: []
        }
    }
}


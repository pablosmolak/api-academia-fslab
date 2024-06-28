import { Body, Controller, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosDTO } from './usuarios.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuarioService: UsuariosService){}

    @Post()
    create(
        @Body() users: UsuariosDTO
    ){
        return this.usuarioService.create(users)
    }
}

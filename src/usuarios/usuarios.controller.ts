import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FiltersUsuarioDTO, UsuariosDTO } from './usuarios.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuarioService: UsuariosService) { };

    @Post()
    create(
        @Body() users: UsuariosDTO
    ) {
        return this.usuarioService.create(users);
    };

    @Get()
    @ApiQuery({name:'email', type: String, required:false})
    @ApiQuery({name:'nome', type: String, required:false})
    findAll(
        @Query() filter: FiltersUsuarioDTO
    ) {
        return this.usuarioService.findAll(filter);
    };

    @Get('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    findByID(
        @Param('id') id: string

    ) {
        return this.usuarioService.findByID(id);
    };

    @Patch()
    update(
        @Param('id') id: string,
        @Body() users: UsuariosDTO
    ){
        return this.usuarioService.update(id, users);
    };

    @Delete('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    remove(
        @Param('id') id: string
    ){
        return this.usuarioService.remove(id);
    };
};

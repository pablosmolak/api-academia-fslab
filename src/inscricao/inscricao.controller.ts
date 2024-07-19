import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InscricaoDTO } from './inscricao.dto';

@ApiTags("Inscrições")
@Controller('inscricao')
export class InscricaoController {

    constructor(private readonly inscricaoService: InscricaoService) { }

    @Post()
    create(
        @Body() inscricao: InscricaoDTO
    ) {
        return this.inscricaoService.create(inscricao);
    }

    @Get()
    findAll(
    ) {
        return this.inscricaoService.findAll();
    }

    @Get('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    findByID(
        @Param('id') id: string
    ) {
        return this.inscricaoService.findByID(id);
    }

    @Patch()
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    update(
        @Param('id') id: string,
        @Body() inscricao: InscricaoDTO
    ) {
        return this.inscricaoService.update(id, inscricao);
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    remove(
        @Param('id') id: string
    ) {
        return this.inscricaoService.remove(id);
    }
}

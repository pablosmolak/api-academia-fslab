import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FiltersInscricaoDTO, InscricaoDTO } from './inscricao.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags("Inscrições")
@Controller('inscricoes')
export class InscricaoController {

    constructor(private readonly inscricaoService: InscricaoService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    create(
        @Req() request: any,
        @Body() inscricao: InscricaoDTO
    ) {
        return this.inscricaoService.create(request, inscricao);
    }

    @Get()
    @ApiQuery({name:'usuarioId', type: String, required:false})
    @ApiQuery({name:'cursoId', type: String, required:false})
    findAll(
        @Query() filter: FiltersInscricaoDTO
    ) {
        return this.inscricaoService.findAll(filter);
    }

    @Delete('/:userid/:cursoid')
    @ApiParam({ name: 'usuarioid', type: String, description: 'ID do usuário' })
    @ApiParam({ name: 'cursoid', type: String, description: 'ID do curso' })
    remove(
        @Param('usuarioid') userID: string,
        @Param('cursoid') cursoID: string
    ) {
        return this.inscricaoService.remove(userID, cursoID);
    }
}

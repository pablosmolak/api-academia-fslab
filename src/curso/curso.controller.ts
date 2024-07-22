import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoDTO } from './curso.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Cursos')
@Controller('curso')
export class CursoController {

    constructor(private readonly cursoService: CursoService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    create(
        @Body() curso: CursoDTO
    ){
        return this.cursoService.create(curso)
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    findAll(){
        return this.cursoService.findAll()
    }
}

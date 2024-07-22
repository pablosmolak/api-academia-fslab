import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoDTO } from './curso.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Cursos')
@Controller('cursos')
export class CursoController {

    constructor(private readonly cursoService: CursoService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    create(
        @Req() request: any,
        @Body() curso: CursoDTO
    ){
        return this.cursoService.create(request, curso)
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    findAll(){
        return this.cursoService.findAll()
    }
}

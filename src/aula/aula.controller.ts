import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AulaDTO } from './aula.dto';
import { AulaService } from './aula.service';

@ApiTags("Aulas")
@Controller('aulas')
export class AulaController {

    constructor(private readonly aulaService: AulaService) {}

    @Post()
    create(
        @Body() aula: AulaDTO
    ){
        return this.aulaService.create(aula)
    }
    
    @Get("/:id")
    @ApiParam({ name: 'id', type: String, description: 'ID da aula' })
    findById(
        @Param('id') id: string
    ){
        return this.aulaService.findById(id)
    }

    @Get("/curso/:cursoId")
    @ApiParam({ name: 'cursoId', type: String, description: 'ID do curso' })
    findByCurso(
        @Param('cursoId') id: string
    ){
        return this.aulaService.findByCurso(id)
    }

    @Patch("/:id")
    @ApiParam({ name: 'id', type: String, description: 'ID da aula' })
    update(
        @Param("id") id: string,
        @Body() aula: AulaDTO
    ){
        return this.aulaService.update(id,aula)
    }

    @Delete("/:id")
    @ApiParam({ name: 'id', type: String, description: 'ID da aula' })
    remove(
        @Param('id') id: string
    ){
        return this.aulaService.remove(id)
    }

}

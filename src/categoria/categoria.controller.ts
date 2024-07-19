import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { categoriaDTO } from './categoria.dto';

@ApiTags('Categorias')
@Controller('categoria')
export class CategoriaController {

    constructor(private readonly categoriaService: CategoriaService){}

    @Post()
    create(
        @Body() categoria: categoriaDTO
    ){
        return this.categoriaService.create(categoria)
    }

    @Get()
    findAll(){
        return this.categoriaService.findAll()
    }

    @Get('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    findByID(
        @Param('id') id: string
    ){
        return this.categoriaService.findByID(id)
    }

    @Patch('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    update(
        @Param('id') id: string,
        @Body() categoria: categoriaDTO
    ){
        return this.categoriaService.update(id,categoria)
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', type: String, description: 'ID do usuário' })
    remove(
        @Param('id') id: string
    ){
        return this.categoriaService.remove(id)
    }
}

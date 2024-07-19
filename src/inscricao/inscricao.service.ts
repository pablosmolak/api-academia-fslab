import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import { InscricaoDTO } from './inscricao.dto';


@Injectable()
export class InscricaoService {

    constructor(
        private readonly prisma:PrismaService,
        private readonly utils: UtilsService
    ){}

    async create(inscricao: InscricaoDTO){

    }

    async findAll(){

    }

    async findByID(id:string){

    }

    async update(id:string, inscricao: InscricaoDTO){

    }

    async remove(id:string){

    }
}

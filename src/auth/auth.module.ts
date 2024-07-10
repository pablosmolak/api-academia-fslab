import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [JwtModule.registerAsync({
        global: true,
        imports: [],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {expiresIn: +configService.get<number>('JWT_EXPIRATION')}
        }),
        inject: [ConfigService]
    })],
    providers: [AuthService, PrismaService],
    controllers: [AuthController]
})
export class AuthModule {}

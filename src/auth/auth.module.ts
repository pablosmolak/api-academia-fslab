import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.registerAsync({
        global: true,
        imports: [],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {expiresIn: +configService.get<number>('JWT_EXPIRATION')}
        }),
        inject: [ConfigService]
    })]
})
export class AuthModule {}

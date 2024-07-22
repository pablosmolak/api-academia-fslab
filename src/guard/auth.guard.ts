import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from 'src/utils/utils.service';
import { messages } from 'src/utils/mensagens';

@Injectable()
export class AuthGuard implements CanActivate {

  private jwtSecret: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly utis: UtilsService
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request)

    if (!token) {
        this.utis.respostaErro(401,[messages.auth.invalidToken])
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this.jwtSecret })

      request['user'] = payload
    } catch {
      this.utis.respostaErro(401,[messages.auth.invalidToken])
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []

    return type === 'Bearer' ? token : undefined
  }
}
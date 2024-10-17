import { Strategy } from 'passport-local';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy)
  implements AbstractStrategy
{
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUserByLogin(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import Token from '../types/Token';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements AbstractStrategy
{
  constructor(private authService: AuthService) {
    dotenv.config();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Token) {
    let user = null;
    if (payload.type !== 'reload')
      user = await this.authService.validateUserByToken(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

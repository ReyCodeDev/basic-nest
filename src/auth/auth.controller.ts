import {
  Controller,
  Request,
  Post,
  UseGuards,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import Token from './types/Token';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/refresh')
  async refresh(@Request() req) {
    const refreshToken = req.body.refresh_token;

    // Valida el refresh token
    const user = await this.authService.validateToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const payload = {
      username: user.username,
      _id: user._id,
    } as Token;
    // Genera un nuevo token de acceso
    const newAccessToken = await this.authService.generateAccessToken(payload);

    return {
      access_token: newAccessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/changepass')
  async changePass(@Request() req) {
    if (req.body.newPassword && req.body.confirm === req.body.newPassword) {
      const hashpass = await this.authService.generatePasswordHash(
        req.body.newPassword,
      );
      return await this.userService.updatePassword(req.user, hashpass);
    }
    return false;
  }
}

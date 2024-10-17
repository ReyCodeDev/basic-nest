import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import User from 'src/users/User';
import Token from './types/Token';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByLogin(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user && (await this.comparePassword(pass, user.password))) {
      const { ...result } = user;
      delete result['password'];
      return result;
    }
    return null;
  }

  async validateUserByToken(token: Token): Promise<any> {
    if (typeof token._id == 'string') {
      token._id = new ObjectId(token._id);
    }
    const user = await this.usersService.findOne(token._id);
    if (user) {
      const { ...result } = user;
      delete result['password'];
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payloadAT = {
      username: user.username,
      _id: user._id,
    };
    const payloadRT: Token = {
      username: user.username,
      _id: user._id,
      type: 'reload',
    };
    const returnable: any = {
      access_token: await this.generateAccessToken(payloadAT), //this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(payloadRT), //this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
    if (user.updatePassword === undefined || user.updatePassword === true) {
      returnable.change_pass = true;
    }
    return returnable;
  }

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  async generatePasswordHash(password: string) {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(plaintextPassword: string, hash: string) {
    return await bcrypt.compare(plaintextPassword, hash);
  }

  async validateToken(token: string): Promise<User> {
    try {
      if (token) return this.jwtService.verifyAsync(token);
    } catch (error) {
      console.log(error);
      return null;
    }
    return null;
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(person: string = 'World'): string {
    return `Hello ${person}!`;
  }
}

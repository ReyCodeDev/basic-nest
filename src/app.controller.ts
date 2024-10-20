import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(): object {
    return {
      message: this.appService.getHello(),
    };
  }
  @Get('messages')
  @Render('messages')
  getMessages(): object {
    return {
      message: this.appService.getHello(),
    };
  }
  @Get('/api')
  getHelloApi(): object {
    return {
      message: this.appService.getHello(),
    };
  }
}

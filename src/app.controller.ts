import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  get(): object {
    return {
      message: this.appService.getHello(),
    };
  }

  @Post()
  @Render('index')
  post(@Body() body: any) {
    return {
      message: this.appService.getHello(body.message),
    };
  }
}

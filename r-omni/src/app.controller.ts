import {Controller, Get, Header, HttpCode, Query, Redirect} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(203)
  @Header('Cache-Control', 'no-store')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redirect')
  @Redirect('/', 302)
  redirect(@Query('yes') version) {
    if (version && version === 'true') {
      return { url: 'http://example.org', HttpCode: 301 };
    }
  }
}

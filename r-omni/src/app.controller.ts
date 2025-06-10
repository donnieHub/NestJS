import {Controller, Get, Header, HttpCode, Param, Query, Redirect} from '@nestjs/common';
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

  @Get('product/:id')
  getProduct(@Param('id') id: number): string {
    console.log('Get product with id: ' + id);
    return `This action returns a #${id} product`;
  }
}

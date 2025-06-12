import {Controller, Get, Header, HttpCode, Param, Query, Redirect} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(203)
  @Header('Cache-Control', 'no-store')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('redirect')
  @Redirect('/', 302)
  async redirect(@Query('yes') version: string) {
    if (version && version === 'true') {
      return { url: 'http://example.org', HttpCode: 301 };
    }
  }

  @Get('product/:id')
  async getProduct(@Param('id') id: number): Promise<string> {
    console.log('Get product with id: ' + id);
    return `This action returns a #${id} product`;
  }
}

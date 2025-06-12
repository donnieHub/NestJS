import {Body, Controller, Get, Header, HttpCode, Param, Post, Query, Redirect} from '@nestjs/common';
import { AppService } from './app.service';
import {CreateReservationDto} from "./dto/CreateReservationDto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(203)
  @Header('Cache-Control', 'no-store')
  async getMainPage(): Promise<string> {
    return this.appService.getMainMage();
  }

  @Post('create')
  async createReservation(@Body() createReservationDto: CreateReservationDto): Promise<string> {
    return `RESERVATION CREATED. You reserved room with id ${createReservationDto.roomId} from ${createReservationDto.startDate} to ${createReservationDto.endDate}`;
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

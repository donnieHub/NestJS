import {Body, Controller, Get, Header, HttpCode, Param, ParseIntPipe, Post, Render} from '@nestjs/common';
import { AppService } from './app.service';
import {CreateReservationDto} from "./dto/CreateReservationDto";
import {rooms} from "./rooms";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  @Render('index')
  @Header('Cache-Control', 'no-store')
  async getMainPage() {
    return this.appService.getMainMage();
  }

  @Post('create')
  async createReservation(@Body() createReservationDto: CreateReservationDto): Promise<string> {
    return `RESERVATION CREATED. You reserved room with id ${createReservationDto.roomId} from ${createReservationDto.startDate} to ${createReservationDto.endDate}`;
  }

  @Get('room/:id')
  async getRoomInfo(@Param('id', ParseIntPipe) id: number) {
    console.log('Get information about room with id: ' + id);
    return { room: rooms.find((x) => x.id === id) };
  }
}

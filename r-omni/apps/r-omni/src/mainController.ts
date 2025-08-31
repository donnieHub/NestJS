import {Body, Controller, Get, Header, HttpCode, Param, ParseIntPipe, Post, Render} from '@nestjs/common';
import { MainService } from './main.service';
import {CreateReservationDto} from "./dto/CreateReservationDto";
import {rooms} from "./rooms.old";

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get()
  @HttpCode(200)
  @Render('index')
  @Header('Cache-Control', 'no-store')
  async getMainPage() {
    return this.mainService.getMainMage();
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

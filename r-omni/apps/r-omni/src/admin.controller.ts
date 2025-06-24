import {Controller, Get} from '@nestjs/common';
import { MainService } from './main.service';

@Controller({ host: 'admin.example.com' })
export class AdminController {
  constructor(private readonly appService: MainService) {}

  @Get()
  async index(): Promise<string> {
    return await this.appService.getAdmin();
  }

}

import {Controller, Get} from '@nestjs/common';
import { MainService } from './main.service';

@Controller({ host: 'admin.example.com' })
export class AdminController {
  constructor(private readonly appService: MainService) {}

  @Get()
  index(): string {
    return this.appService.getAdmin();
  }

}

import {Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ host: 'admin.example.com' })
export class AdminController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): string {
    return this.appService.getAdmin();
  }

}

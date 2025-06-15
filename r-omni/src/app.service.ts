import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMainMage() {
    return { title: 'Сервис по бронированию гостиниц' };
  }

  getAdmin(): string {
    return 'Admin Page';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMainHeader(): string {
    return 'Сервис по бронированию гостиниц';
  }

  getAdmin(): string {
    return 'Admin Page';
  }
}

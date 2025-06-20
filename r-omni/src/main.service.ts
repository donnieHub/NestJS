import { Injectable } from '@nestjs/common';

@Injectable()
export class MainService {
  async getMainMage() {
    return { title: 'Сервис по бронированию гостиниц' };
  }

  async getAdmin(): Promise<string> {
    return 'Admin Page';
  }
}

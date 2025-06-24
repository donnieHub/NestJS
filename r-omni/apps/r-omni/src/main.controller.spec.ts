import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './mainController';
import { MainService } from './main.service';

describe('MainController', () => {
  let mainController: MainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
      providers: [MainService],
    }).compile();

    mainController = app.get<MainController>(MainController);
  });

  describe('root', () => {
    it('should return "Сервис по бронированию гостиниц"', async () => {
      const result = await mainController.getMainPage();
      expect(result).toEqual( { title: 'Сервис по бронированию гостиниц' } );
    });
  });
});

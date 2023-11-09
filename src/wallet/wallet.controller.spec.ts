import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/strategy/jwt-guard';
import { HttpStatus, BadRequestException } from '@nestjs/common';

describe('WalletController', () => {
  let controller: WalletController;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [WalletService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mocking the JwtAuthGuard
      .compile();

    controller = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
  });

  describe('fundAccount', () => {
    it('should fund the account successfully', async () => {});
  });
});

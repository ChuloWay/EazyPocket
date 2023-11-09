import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferFundDto } from './dto/transfer.dto';
import { WithdrawFundDto } from './dto/withdraw.dto';
import knexfile from '../config/knexfile';
import knex from 'knex';

let db;
let walletService: WalletService;

beforeEach(async () => {
  db = knex(knexfile.test);
  await db.migrate.latest();
});

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [WalletService],
  }).compile();

  walletService = module.get<WalletService>(WalletService);
});

describe('WalletService', () => {
  beforeEach(async () => {
    // Delete data from dependent tables first
    await db('transactions').delete();
    await db('wallets').delete();

    // Then delete data from the main table
    await db('users').delete();
  });

  describe('fundAccount', () => {
    it('should fund the account successfully', async () => {
      // Add test data to the users and wallets tables
      const userId = 'mn3bb-bee1-4ba6-b6b9-802336624ff1';
      await db.table('users').insert({
        id: userId,
        firstName: 'John',
        lastName: 'Larson',
        email: 'Johnson@example.com',
        phoneNumber: '+12874516789',
        password: 'dummy_password',
      });

      await db.table('wallets').insert({
        userId,
        balance: 0,
      });

      const walletDto: FundWalletDto = { amount: 100 };

      const result = await walletService.fundAccount(userId, walletDto);

      expect(result.user.id).toBe(userId);
      expect(result.user.balance).toBe(100);
    });

    it('should throw an error if the user is not found', async () => {
      const userId = 1;
      const walletDto: FundWalletDto = { amount: 100 };

      await expect(walletService.fundAccount(userId, walletDto)).rejects.toThrow('Failed to fund the account');
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds successfully', async () => {
      // Add test data to the users and wallets tables
      const senderId = 'gwzaa0f6-bee1-4ba6-b6b9-802336624ff1';
      const senderExists = await db.table('users').where('id', senderId).first();

      if (!senderExists) {
        await db.table('users').insert({
          id: senderId,
          firstName: 'Victor',
          lastName: 'Larson',
          email: 'victor@example.com',
          phoneNumber: '+12314516989',
          password: 'dummy_password',
        });
      }

      const senderWalletExists = await db.table('wallets').where('userId', senderId).first();

      if (!senderWalletExists) {
        await db.table('wallets').insert({
          userId: senderId,
          balance: 100,
        });
      }

      // Add test data to the users and wallets tables
      const receiverId = 'hw0artf6-bee1-4ba6-b6b9-802336624ff1';
      const receiverExists = await db.table('users').where('id', receiverId).first();

      if (!receiverExists) {
        await db.table('users').insert({
          id: receiverId,
          firstName: 'Harry',
          lastName: 'Jude',
          email: 'harry@example.com',
          phoneNumber: '+12914519789',
          password: 'dummy_password',
        });
      }

      const receiverWalletExists = await db.table('wallets').where('userId', receiverId).first();

      if (!receiverWalletExists) {
        await db.table('wallets').insert({
          userId: receiverId,
          balance: 0,
        });
      }

      const transferDto: TransferFundDto = { receiverId, amount: 50 };

      const result = await walletService.transferFunds(senderId, transferDto);

      expect(result.sender.id).toBe(senderId);
      expect(result.receiver.id).toBe(receiverId);
      expect(result.sender.balance).toBe(50);
      expect(result.receiver.balance).toBe(50);
    });

    it('should throw an error if the sender has insufficient funds', async () => {
      const senderId = 1;
      const receiverId = 2;
      const transferDto: TransferFundDto = { receiverId, amount: 50 };

      await expect(walletService.transferFunds(senderId, transferDto)).rejects.toThrow('Failed to transfer funds');
    });

    it('should throw an error if the sender is transferring to their own wallet', async () => {
      const senderId = 1;
      const transferDto: TransferFundDto = { receiverId: senderId, amount: 50 };

      await expect(walletService.transferFunds(senderId, transferDto)).rejects.toThrow('Failed to transfer funds');
    });
  });

  describe('withdrawFunds', () => {
    it('should withdraw funds successfully', async () => {
      // Add test data to the users and wallets tables
      const userId = 'lo0aa0f6-bee1-4ba6-b6b9-802336624ff1';
      await db.table('users').insert({
        id: userId,
        firstName: 'Victor',
        lastName: 'Larson',
        email: 'victorlarson@example.com',
        phoneNumber: '+12314566789',
        password: 'dummy_password',
      });

      await db.table('wallets').insert({
        userId,
        balance: 100,
      });
      const withdrawDto: WithdrawFundDto = { amount: 30 };

      const result = await walletService.withdrawFunds(userId, withdrawDto);

      expect(result.user.id).toBe(userId);
      expect(result.user.balance).toBe(70);
    });

    it('should throw an error if the user has insufficient funds', async () => {
      const userId = 1;
      const withdrawDto: WithdrawFundDto = { amount: 100 };

      await expect(walletService.withdrawFunds(userId, withdrawDto)).rejects.toThrow('Failed to withdraw funds');
    });
  });
});

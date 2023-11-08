import { Injectable, Logger } from '@nestjs/common';
import db from '../config/index';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferFundDto } from './dto/transfer.dto';
import { WithdrawFundDto } from './dto/withdraw.dto';
const logger = new Logger('WalletService');

@Injectable()
export class WalletService {
  async fundAccount(userId: number, walletDto: FundWalletDto): Promise<{ user: { id: number; balance: number } }> {
    try {
      const { amount } = walletDto;
      return await db.transaction(async (trx) => {
        const user = await db('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', userId)
          .select('users.id as userId', 'wallets.id as walletId', 'wallets.balance')
          .first();

        if (!user) {
          throw new Error('User not found');
        }

        if (!user.hasOwnProperty('balance')) {
          throw new Error('User balance not found');
        }
        // Update the user's balance
        const updatedBalance = user.balance + amount;

        // Update the balance in the 'wallets' table
        await trx('wallets').where('userId', user.userId).update({ balance: updatedBalance });

        // Create a transaction record for the credit
        await trx('transactions').insert({
          senderId: null,
          receiverId: user.walletId,
          amount: amount,
          type: 'CREDIT',
          description: 'Funding wallet',
        });

        return {
          user: {
            id: user.userId,
            balance: updatedBalance,
          },
        };
      });
    } catch (error) {
      logger.error('Error creating user: ' + error.message);
      throw new Error('Failed to fund the account');
    }
  }

  async transferFunds(senderId: number, transferDto: TransferFundDto): Promise<void> {
    try {
      const { receiverId, amount } = transferDto;

      await db.transaction(async (trx) => {
        const senderBalance = await db('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', senderId)
          .select('users.id as senderId', 'wallets.id as walletId', 'wallets.balance')
          .first();

        // Check if the sender has enough funds
        if (!senderBalance || senderBalance.balance < amount) {
          throw new Error('Insufficient funds');
        }

        //check that user is not sending money to his own wallet
        if (senderId === receiverId) {
          throw new Error('You cannot transfer to yourself');
        }

        // Deduct the transfer amount from the sender's balance
        const updatedSenderBalance = senderBalance.balance - amount;
        await trx('wallets').where('userId', senderId).update({ balance: updatedSenderBalance });

        // Add the transfer amount to the recipient's balance
        const recipientBalance = await db('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', receiverId)
          .select('users.id as receiverId', 'wallets.id as walletId', 'wallets.balance')
          .first();

        const updatedRecipientBalance = recipientBalance.balance + amount;
        await trx('wallets').where('userId', receiverId).update({ balance: updatedRecipientBalance });

        // Create a transaction record for the transfer
        await trx('transactions').insert({
          senderId: senderBalance.walletId,
          receiverId: recipientBalance.walletId,
          amount,
          type: 'TRANSFER',
          description: `Transferred ${amount} to user ${receiverId}`,
        });

        // Create a transaction record for the recipient
        await trx('transactions').insert({
          senderId: null, // Recipient's transaction has no sender
          receiverId: recipientBalance.walletId,
          amount,
          type: 'CREDIT',
          description: `Received ${amount} from user ${senderId}`,
        });
      });
    } catch (error) {
      logger.error('Error in transfering: ' + error.message);
      throw new Error('Failed to transfer funds');
    }
  }

  async withdrawFunds(userId: number, withdrawDto: WithdrawFundDto): Promise<void> {
    try {
      const { amount } = withdrawDto;
      await db.transaction(async (trx) => {
        const userBalance = await db('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', userId)
          .select('users.id as userId', 'wallets.id as walletId', 'wallets.balance')
          .first();

        // Check if the sender has enough funds
        if (!userBalance || userBalance.balance < amount) {
          throw new Error('Insufficient funds');
        }

        // Deduct the amount from the user's balance
        const updatedUserBalance = userBalance.balance - amount;
        await trx('wallets').where('userId', userId).update({ balance: updatedUserBalance });

        // Create a transaction record for the transfer
        await trx('transactions').insert({
          senderId: userBalance.walletId,
          receiverId: null,
          amount,
          type: 'WITHDRAWAL',
          description: `Withdrew ${amount} to user ${userId}`,
        });
      });
    } catch (error) {
      logger.error('Error in withdrawal: ' + error.message);
      throw new Error('Failed to withdraw funds');
    }
  }
}

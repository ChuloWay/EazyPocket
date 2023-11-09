import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import db from '../config/index';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferFundDto } from './dto/transfer.dto';
import { WithdrawFundDto } from './dto/withdraw.dto';
const logger = new Logger('WalletService');

@Injectable()
export class WalletService {
  async fundAccount(userId: any, walletDto: FundWalletDto): Promise<{ user: { id: any; balance: any } }> {
    try {
      const { amount } = walletDto;

      // Use the knex.transaction method directly
      const result = await db.transaction(async (trx) => {
        // Use destructuring to simplify code
        const [user] = await trx('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', userId)
          .select('users.id as userId', 'wallets.id as walletId', 'wallets.balance');

        // Check if the user exists
        if (!user) {
          throw new Error('User not found');
        }

        // Update the user's balance
        const updatedBalance = user.balance + amount;

        // Update the balance in the 'wallets' table
        await trx('wallets').where('userId', user.userId).update({ balance: updatedBalance });

        // Create a transaction record for the credit
        await trx('transactions').insert({
          senderId: null,
          receiverId: user.walletId,
          amount,
          type: 'CREDIT',
          description: 'Funding wallet',
        });

        // Return the updated user information
        return {
          user: {
            id: user.userId,
            balance: updatedBalance,
          },
        };
      });

      return result;
    } catch (error) {
      // logger.error(`Error funding account: ${error.message}`);
      throw new Error('Failed to fund the account');
    }
  }

  async transferFunds(
    senderId: any,
    transferDto: TransferFundDto,
  ): Promise<{ sender: { id: number; balance: number }; receiver: { id: number; balance: number } }> {
    try {
      const { receiverId, amount } = transferDto;

      // Use the knex.transaction method directly
      const result = await db.transaction(async (trx) => {
        // Use destructuring to simplify code for sender's balance
        const [senderBalance] = await trx('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', senderId)
          .select('users.id as senderId', 'wallets.id as walletId', 'wallets.balance');

        // Check if the sender has enough funds
        if (!senderBalance || senderBalance.balance < amount) {
          throw new Error('Insufficient funds');
        }

        // Check if the transfer is not to the sender's own wallet
        if (senderId === receiverId) {
          throw new BadRequestException('You cannot transfer to yourself');
        }

        // Deduct the transfer amount from the sender's balance
        const updatedSenderBalance = senderBalance.balance - amount;
        await trx('wallets').where('userId', senderId).update({ balance: updatedSenderBalance });

        // Add the transfer amount to the recipient's balance
        const [recipientBalance] = await trx('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', receiverId)
          .select('users.id as receiverId', 'wallets.id as walletId', 'wallets.balance');

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
          senderId: null,
          receiverId: recipientBalance.walletId,
          amount,
          type: 'CREDIT',
          description: `Received ${amount} from user ${senderId}`,
        });

        // Return information about the sender and recipient
        return {
          sender: {
            id: senderBalance.senderId,
            balance: updatedSenderBalance,
          },
          receiver: {
            id: recipientBalance.receiverId,
            balance: updatedRecipientBalance,
          },
        };
      });

      return result; // Return the result outside the transaction callback
    } catch (error) {
      // Use logger.error with a template string
      // logger.error(`Error transferring funds: ${error.message}`);

      // Rethrow the error with a custom message
      throw new Error('Failed to transfer funds');
    }
  }

  async withdrawFunds(userId: any, withdrawDto: WithdrawFundDto): Promise<{ user: { id: number; balance: number } }> {
    try {
      const { amount } = withdrawDto;

      // Use the knex.transaction method directly
      const result = await db.transaction(async (trx) => {
        // Use destructuring to simplify code for user's balance
        const [userBalance] = await trx('users')
          .join('wallets', 'users.id', 'wallets.userId')
          .where('users.id', userId)
          .select('users.id as userId', 'wallets.id as walletId', 'wallets.balance');

        // Check if the user has enough funds
        if (!userBalance || userBalance.balance < amount) {
          throw new Error('Insufficient funds');
        }

        // Deduct the amount from the user's balance
        const updatedUserBalance = userBalance.balance - amount;
        await trx('wallets').where('userId', userId).update({ balance: updatedUserBalance });

        // Create a transaction record for the withdrawal
        await trx('transactions').insert({
          senderId: userBalance.walletId,
          receiverId: null,
          amount,
          type: 'WITHDRAWAL',
          description: `Withdrew ${amount} to user ${userId}`,
        });

        // Return updated user information
        return {
          user: {
            id: userBalance.userId,
            balance: updatedUserBalance,
          },
        };
      });

      return result; // Return the result outside the transaction callback
    } catch (error) {
      // Use logger.error with a template string
      logger.error(`Error withdrawing funds: ${error.message}`);

      // Rethrow the error with a custom message
      throw new Error('Failed to withdraw funds');
    }
  }
}

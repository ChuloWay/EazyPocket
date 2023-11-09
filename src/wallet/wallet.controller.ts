import { Controller, Post, Body, UseGuards, Req, Res, Next, HttpStatus, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/strategy/jwt-guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('fund')
  async fundAccount(@Body() body, @Req() req, @Res() res, @Next() next) {
    try {
      const userObject = req.user;
      const { id } = userObject;
      const data = await this.walletService.fundAccount(id, body);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data,
        message: 'Success',
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('transfer')
  async transferFunds(@Body() body, @Req() req, @Res() res, @Next() next) {
    try {
      const userObject = req.user;
      const { id } = userObject;
      const data = await this.walletService.transferFunds(id, body);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data,
        message: 'Funds transferred successfully',
      });
    } catch (error) {
      next(error);
      throw new BadRequestException('Failed to transfer funds');
    }
  }

  @Post('withdraw')
  async withdrawFunds(@Body() body, @Req() req, @Res() res, @Next() next) {
    try {
      const userObject = req.user;
      const { id } = userObject;
      const data = await this.walletService.withdrawFunds(id, body);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data,
        message: 'Funds withdrawn successfully',
      });
    } catch (error) {
      next(error);
      throw new BadRequestException('Failed to withdraw funds');
    }
  }
}

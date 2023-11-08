import { IsNotEmpty, IsNumber } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

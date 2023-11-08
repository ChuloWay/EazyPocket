import { IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawFundDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

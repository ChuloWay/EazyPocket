import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferFundDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

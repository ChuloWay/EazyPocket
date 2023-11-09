import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferFundDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: any;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

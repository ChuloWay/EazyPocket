import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';

@Injectable()
export class UtilityService {
  // Implement your password hashing logic here
  public async hashPassword(password: string): Promise<string> {
    return hashSync(password, 11);
  }

  //compare password
  public async comparePassword(newPassword: string, passwordHash: string): Promise<boolean> {
    try {
      return await compareSync(newPassword, passwordHash);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

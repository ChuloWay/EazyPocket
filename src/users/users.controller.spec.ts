import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('should return user profile when user exists', async () => {
      const userId = 1;
      const userProfile = { id: userId, name: 'John Doe', email: 'john.doe@example.com' };
      jest.spyOn(userService, 'findUserProfileById').mockResolvedValueOnce(userProfile);

      const result = await controller.getUserProfile(userId);

      expect(result).toEqual(userProfile);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 2;
      jest.spyOn(userService, 'findUserProfileById').mockResolvedValueOnce(null);

      await expect(controller.getUserProfile(userId)).rejects.toThrow(NotFoundException);
    });
  });
});

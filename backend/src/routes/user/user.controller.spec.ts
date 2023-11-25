import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {UserService} from "../user.service/user.service";
import {GetUserResponseDto} from "./DTOs/GetUserResponseDTO";
import {ISession} from "../../utils/ISession";
import {User} from "../../database/User";

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should get logged-in user', async () => {
    const session = { userData: { id: 1 } }; // Mock session object
    const userDto = new GetUserResponseDto(); // Mock user DTO

    jest.spyOn(userController['userService'], 'getUserById').mockResolvedValue(userDto as User);

    const result = await userController.getLoggedInUser(session as ISession);

    expect(result).toBe(userDto);
  });
});
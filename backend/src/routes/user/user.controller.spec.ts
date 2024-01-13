import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../user.service/user.service';
import { ISession } from '../../utils/ISession';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth.service/auth.service';
import { LogInRequestDto } from '../auth/DTOs/LoginRequestDTO';
import * as fs from 'fs';
import { UpdateUserRequestDto } from './DTOs/UpdateUserRequestDTO';
import { MockCreateUser } from './Mocks/MockCreateUser';
import { MockGetUser } from './Mocks/MockGetUser';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MockSession } from './Mocks/MockSession';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import { PlzService } from '../plz.service/plz.service';
import { RatingService } from '../rating.service/rating.service';

describe('UserController', () => {
  let userController: UserController;
  let authController: AuthController;
  let userForThisTest: User;
  const session: ISession = new MockSession();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.user.controller.sqlite'),
        TypeOrmModule.forFeature(entityArr),
      ],
      controllers: [UserController, AuthController],
      providers: [UserService, AuthService, PlzService, RatingService],
    }).compile();

    userController = module.get<UserController>(UserController);
    authController = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await authController.logout(session);

    fs.unlink('./db/tmp.tester.user.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should post a user to the database', async () => {
    const user = new MockCreateUser(true);
    userForThisTest = new MockCreateUser(true) as User;
    const responseMock = new OKResponseWithMessageDTO(true, 'User Created');

    const result = await userController.postUser(user);

    expect(result).toStrictEqual(responseMock);
  });

  it('should not allow to post a underage user', async () => {
    const user = new MockCreateUser(true);
    user.birthday = new Date();

    await expect(userController.postUser(user)).rejects.toThrow(
      new ForbiddenException(
        'You have to be at least 18 years old to create an account.',
      ),
    );
  });

  it('should log in the created user', async () => {
    const responseMock = new OKResponseWithMessageDTO(
      true,
      `Successfully logged in`,
    );

    const loginDTO = new LogInRequestDto();
    loginDTO.eMail = userForThisTest.eMail;
    loginDTO.password = userForThisTest.password;

    const result = await authController.login(session, loginDTO);

    expect(result).toStrictEqual(responseMock);
  });

  it('should get logged-in user', async () => {
    const userDto = new MockGetUser(true);
    userDto.averageRatings = {
      amount: 0,
      cargoArrivedUndamaged: 0,
      comfortDuringTrip: 0,
      passengerPleasantness: 0,
      punctuality: 0,
      reliability: 0,
      total: 0,
    };


    const result = await userController.getLoggedInUser(session);

    expect(result).toEqual(userDto);
  });

  it('should update the logged-in user', async () => {
    const updateDTO = new UpdateUserRequestDto();
    updateDTO.description = 'Max will testen';
    updateDTO.firstName = 'Maxiii';
    updateDTO.lastName = 'Mustermanni';
    updateDTO.birthday = new Date('2002-02-18');

    const responseMock = new OKResponseWithMessageDTO(true, 'User Updated');

    const result = await userController.updateUser(session, updateDTO);

    expect(result).toStrictEqual(responseMock);
  });

  it('should handle duplicate email error when creating a user', async () => {
    const user = new MockCreateUser();

    const resMock = new InternalServerErrorException(
      'E-Mail bereits vergeben!',
    );

    expect(await userController.postUser(user)).toEqual(resMock);
  });

  it('should return an error when attempting to update a non-existing user', async () => {
    const invalidSession: ISession = new MockSession(true);
    invalidSession.userData.id = 9999;

    const updateDTO = new UpdateUserRequestDto();
    updateDTO.description = 'Max will testen';
    const resMock = new NotFoundException('No User with this Id found.');
    try {
      const res = await userController.updateUser(invalidSession, updateDTO);
      expect(res).not.toEqual(
        new OKResponseWithMessageDTO(true, 'User Updated'),
      );
    } catch (e) {
      expect(e).toEqual(resMock);
    }
  });

  it('should delete the logged-in user', async () => {
    const responseMock = new OKResponseWithMessageDTO(true, 'User deleted.');

    const result = await userController.deleteUser(session);

    expect(result).toStrictEqual(responseMock);
  });
});

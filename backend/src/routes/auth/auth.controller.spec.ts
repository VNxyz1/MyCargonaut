import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service/user.service';
import { ISession } from '../../utils/ISession';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { AuthController } from './auth.controller';
import { AuthService } from '../auth.service/auth.service';
import { LogInRequestDto } from './DTOs/LoginRequestDTO';
import * as fs from 'fs';
import { UserController } from '../user/user.controller';
import { GetLogInResponseDto } from './DTOs/GetLoginResponseDto';
import { MockCreateUser } from '../user/Mocks/MockCreateUser';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import { PlzService } from '../plz.service/plz.service';
import { MockSession } from '../user/Mocks/MockSession';
import { RatingService } from '../rating.service/rating.service';
import { RatingController } from "../rating/rating.controller";
import { OfferService } from "../offer.service/offer.service";

describe('AuthController', () => {
  let userController: UserController;
  let authController: AuthController;
  let userForThisTest: User;
  const session: ISession = new MockSession(true);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        sqlite_setup('./db/tmp.tester.auth.controller.sqlite'),
        TypeOrmModule.forFeature(entityArr),
      ],
      controllers: [UserController, AuthController, RatingController],
      providers: [UserService, AuthService, PlzService, RatingService, OfferService],
    }).compile();

    userController = module.get<UserController>(UserController);
    authController = module.get<AuthController>(AuthController);

    await postTempUser();
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.auth.controller.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should log in the created user', async () => {
    const responseMock = new OKResponseWithMessageDTO(
      true,
      `Successfully logged in`,
    );

    const loginDTO = new LogInRequestDto();
    loginDTO.eMail = userForThisTest.eMail;
    loginDTO.password = '1234';

    const result = await authController.login(session, loginDTO);

    expect(result).toStrictEqual(responseMock);
  });

  it('should return true if a user is logged in', async () => {
    await logInTheTempUser();

    const responseMock = new GetLogInResponseDto(true);

    const result = await authController.getLogin(session);

    expect(result).toStrictEqual(responseMock);
  });

  it('should log out the created user', async () => {
    const responseMock = new OKResponseWithMessageDTO(
      true,
      `Successfully logged out`,
    );

    const result = await authController.logout(session);

    expect(result).toStrictEqual(responseMock);
  });

  it('should return false if no user is logged in', async () => {
    const responseMock = new GetLogInResponseDto(false);

    const result = await authController.getLogin(session);

    expect(result).toStrictEqual(responseMock);
  });

  async function postTempUser() {
    const user = new MockCreateUser();

    await userController.postUser(user);

    userForThisTest = user as User;
  }

  async function logInTheTempUser() {
    const loginDTO = new LogInRequestDto();
    loginDTO.eMail = userForThisTest.eMail;
    loginDTO.password = '1234';
    await authController.login(session, loginDTO);
  }
});

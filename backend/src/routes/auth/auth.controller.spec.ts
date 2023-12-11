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
import { CreateUserRequestDto } from '../user/DTOs/CreateUserRequestDTO';
import { GetLogInResponseDto } from './DTOs/GetLoginResponseDto';

describe('AuthController', () => {
  let userController: UserController;
  let authController: AuthController;
  let userForThisTest: User;
  const session: ISession = {
    isLoggedIn: false,
    userData: {
      id: 0,
      eMail: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      profilePicture: '',
      birthday: undefined,
      coins: 0,
      description: '',
      entryDate: undefined,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.auth.controller.sqlite',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UserController, AuthController],
      providers: [UserService, AuthService],
    }).compile();

    userController = module.get<UserController>(UserController);
    authController = module.get<AuthController>(AuthController);

    await postTempUser();
  });

  afterEach(async () => {
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
    loginDTO.password = userForThisTest.password;

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
    const user = new CreateUserRequestDto();
    user.eMail = 'testerAuth@test.com';
    user.firstName = 'Max';
    user.lastName = 'Mustermann';
    user.profilePicture = '/profile-pictures/12341.png';
    user.password = '1234';
    user.phoneNumber = '+49 173 55555';
    user.birthday = new Date('2002-02-18');

    await userController.postUser(user);

    userForThisTest = user as User;
  }

  async function logInTheTempUser() {
    const loginDTO = new LogInRequestDto();
    loginDTO.eMail = userForThisTest.eMail;
    loginDTO.password = userForThisTest.password;
    await authController.login(session, loginDTO);
  }
});

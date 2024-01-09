import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service/user.service';
import { User } from '../../database/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import * as fs from 'fs';
import { CreateUserRequestDto } from '../user/DTOs/CreateUserRequestDTO';
import { Offer } from '../../database/Offer';
import { Plz } from '../../database/Plz';
import { TransitRequest } from '../../database/TransitRequest';
import { RoutePart } from '../../database/RoutePart';
import { PlzService } from '../plz.service/plz.service';
import { TripRequest } from '../../database/TripRequest';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let userForThisTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './db/tmp.tester.auth.service.sqlite',
          entities: [User, Offer, Plz, TransitRequest, RoutePart, TripRequest],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          User,
          Offer,
          Plz,
          TransitRequest,
          RoutePart,
          TripRequest,
        ]),
      ],
      providers: [UserService, AuthService, PlzService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.auth.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should log in the created user', async () => {
    await postTempUser();

    const result = await logInTheTempUser();

    expect(result).toStrictEqual(userForThisTest);
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

    userForThisTest = await userService.postUser(user);
  }

  async function logInTheTempUser() {
    return await authService.getUserByEMail(userForThisTest.eMail);
  }
});

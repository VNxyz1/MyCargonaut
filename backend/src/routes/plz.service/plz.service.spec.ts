import { Test, TestingModule } from '@nestjs/testing';
import { PlzService } from './plz.service';
import { UserController } from '../user/user.controller';
import { AuthController } from '../auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user.service/user.service';
import { AuthService } from '../auth.service/auth.service';
import * as fs from 'fs';
import { entityArr, sqlite_setup } from '../../utils/sqlite_setup';
import { RatingService } from '../rating.service/rating.service';

describe('PlzService', () => {
  //let userController: UserController;
  let plzService: PlzService;
  //let userForThisTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [sqlite_setup('./db/tmp.tester.plz.service.sqlite'), TypeOrmModule.forFeature(entityArr)],
      controllers: [UserController, AuthController],
      providers: [UserService, AuthService, PlzService, RatingService],
    }).compile();

    //userController = module.get<UserController>(UserController);
    plzService = module.get<PlzService>(PlzService);
  });

  afterAll(async () => {
    fs.unlink('./db/tmp.tester.plz.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });

  it('should be defined', () => {
    expect(plzService).toBeDefined();
  });
});

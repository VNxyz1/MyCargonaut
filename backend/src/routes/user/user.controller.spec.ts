import {Test, TestingModule} from '@nestjs/testing';
import {UserController} from './user.controller';
import {UserService} from "../user.service/user.service";
import {GetUserResponseDto} from "./DTOs/GetUserResponseDTO";
import {ISession} from "../../utils/ISession";
import {User} from "../../database/User";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CreateUserRequestDto} from "./DTOs/CreateUserRequestDTO";
import {OKResponseWithMessageDTO} from "../../generalDTOs/OKResponseWithMessageDTO";
import {AuthController} from "../auth/auth.controller";
import {AuthService} from "../auth.service/auth.service";
import {LogInRequestDto} from "../auth/DTOs/LoginRequestDTO";
import * as fs from 'fs';
import {UpdateUserRequestDto} from "./DTOs/UpdateUserRequestDTO";


describe('UserController', () => {
    let userController: UserController;
    let authController: AuthController;
    let userForThisTest: User;
    let session: ISession = {
        isLoggedIn: false,
        userData: {
            id: 0,
            eMail: '',
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            profilePicture: ''
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: './db/tmp.tester.sqlite',
                    entities: [User],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([User])
            ],
            controllers: [UserController, AuthController],
            providers: [UserService, AuthService],
        }).compile();

        userController = module.get<UserController>(UserController);
        authController = module.get<AuthController>(AuthController);
    });

    afterAll(async () => {
        fs.unlink("./db/tmp.tester.sqlite", (err) => {
            if (err) {
                console.error(`Fehler beim Löschen der Datei: ${err.message}`);
            } else {
                console.log('Datei erfolgreich gelöscht.');
            }
        });
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should post a user to the database', async () => {
        const user = new CreateUserRequestDto();
        user.username = "Test";
        user.eMail = "tester@test.com";
        user.firstName = "Max";
        user.lastName = "Mustermann";
        user.profilePicture = "/profile-pictures/12341.png";
        user.password = "1234";

        const responseMock = new OKResponseWithMessageDTO(true, "User Created");

        const result = await userController.postUser(user);

        userForThisTest = user as User;

        expect(result).toStrictEqual(responseMock);
    });

    it('should log in the created user', async () => {

        const responseMock = new OKResponseWithMessageDTO(true, `Successfully logged in`);

        const loginDTO = new LogInRequestDto();
        loginDTO.eMail = userForThisTest.eMail;
        loginDTO.password = userForThisTest.password;

        const result = await authController.login(session, loginDTO);


        expect(result).toStrictEqual(responseMock);
    });


    it('should get logged-in user', async () => {

        const userDto = new GetUserResponseDto();
        userDto.id = 1;
        userDto.username = "Test";
        userDto.eMail = "tester@test.com";
        userDto.firstName = "Max";
        userDto.lastName = "Mustermann";
        userDto.profilePicture = "/profile-pictures/12341.png";

        const result = await userController.getLoggedInUser(session);

        expect(result).toStrictEqual(userDto);
    });

    it('should update the logged-in user', async () => {

        const updateDTO = new UpdateUserRequestDto();
        updateDTO.eMail = "tester@test.com";
        updateDTO.firstName = "Maxiii";
        updateDTO.lastName = "Mustermanni";
        updateDTO.profilePicture = "/profile-pictures/12341.png";

        const responseMock = new OKResponseWithMessageDTO(true, "User Updated");

        const result = await userController.updateUser(session, updateDTO);

        expect(result).toStrictEqual(responseMock);
    });

    it('should delete the logged-in user', async () => {

        const responseMock = new OKResponseWithMessageDTO(true, "User deleted.");


        const result = await userController.deleteUser(session);

        expect(result).toStrictEqual(responseMock);
    });



});
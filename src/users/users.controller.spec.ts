import {Test, TestingModule} from '@nestjs/testing';
import {UsersController} from './users.controller';
import {UsersService} from "./users.service";
import {AuthService} from "./auth.service";
import {User} from "./user.entity";
import {NotFoundException} from "@nestjs/common";
import {CreateUserDto} from "./dtos/create-user.dto";

describe('UsersController', () => {
    let controller: UsersController;
    const password = 'P@ssw0rd';
    const email = 'efpyi@example.com';
    const id = Math.floor(Math.random() * 1000);
    const user: User = {id, email, password} as User;
    const createUserDto: CreateUserDto = {email, password} as CreateUserDto;


    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeAuthService = {
            signin: () => Promise.resolve(user),
            signup: () => Promise.resolve(user)
        };

        fakeUsersService = {
            findOne: () => Promise.resolve(user),
            find: () => Promise.resolve(user),
            remove: () => Promise.resolve(user),
            update: () => Promise.resolve(user)

        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                },

            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findOne throws an error if user with given id is not found', async () => {
        fakeUsersService.findOne = () => null;
        await expect(controller.findOne(id.toString())).rejects.toThrow(NotFoundException);
    });

    it('signin update session object and returns user', async () => {
        const session = {userId: 0};
        const actual = await controller.signin(createUserDto, session);
        expect(actual).toEqual(user);
        expect(session.userId).toEqual(user.id);


    })
});

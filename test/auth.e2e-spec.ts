import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {CreateUserDto} from "../src/users/dtos/create-user.dto";
import {UserDto} from "../src/users/dtos/user.dto";
import {setupApp} from "../src/setup-app";

describe('Authentication System', () => {
    let app: INestApplication;
    const password = 'P@ssw0rd';
    const email = 'abc1@email.com';
    const createUserDto: CreateUserDto = {email, password} as CreateUserDto;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setupApp(app);
        await app.init();
    });

    it('handles a signup request', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send(createUserDto)
            .expect(HttpStatus.CREATED)
            .then((actual) => {
                const userDto: UserDto = actual.body as UserDto;
                expect(userDto.id).toBeDefined();
                expect(userDto.email).toEqual(createUserDto.email);
            });
    });
});

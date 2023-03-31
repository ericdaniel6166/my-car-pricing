import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {CreateUserDto} from "../src/users/dtos/create-user.dto";
import {UserDto} from "../src/users/dtos/user.dto";
import {Connection, getConnectionManager} from "typeorm";

describe('Authentication System', () => {
    let app: INestApplication;
    const password = 'P@ssw0rd';
    const email = 'abc4@email.com';
    const createUserDto: CreateUserDto = {email, password} as CreateUserDto;
    let connection: Connection;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        //TODO: use DataSource API
        connection = moduleFixture.get<Connection>(Connection);
        await connection.dropDatabase();
        await connection.synchronize();
        await app.init();
    });

    afterEach(async () => {
        await connection.close();
        await app.close();
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
    it('signup as a new user then get the currently logged in user', async () => {
        createUserDto.email = 'wyz@email.com'
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

        const cookie = res.get('Set-Cookie');

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie)
            .expect(200);


        expect(body.email).toEqual(createUserDto.email);
    });
});

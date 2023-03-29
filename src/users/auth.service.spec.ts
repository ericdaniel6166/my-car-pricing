import {Test} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {BadRequestException} from "@nestjs/common";


describe('AuthService', () => {
    let service: AuthService;
    const pointSymbol = '.';
    const encryptedPassword = '19590239970f6abd.bddfbeed15ebf43bf42bd42d858e50a9ae7276e13b9be6da036dcea5b621289c';
    const password = 'P@ssw0rd';
    const wrongPassword = 'wrongPassword';
    const email = 'efpyi@example.com';
    const id = Math.floor(Math.random() * 1000);
    const user: User = {id, email, password: encryptedPassword} as User

    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {

        fakeUsersService = {
            find: () => Promise.resolve(user),
            create: (email: string, password: string) => {
                const user: User = {id, email, password} as User;
                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers: [AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();
        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {

        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        fakeUsersService.find = () =>
            Promise.resolve(null);

        const user = await service.signup(email, password);
        expect(user.password).not.toEqual(password)
        const [salt, hash] = user.password.split(pointSymbol);
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await expect(service.signup(email, password))
            .rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called with wrong email', async () => {
        fakeUsersService.find = () =>
            Promise.resolve(null);
        await expect(
            service.signin(email, password),
        ).rejects.toThrow(BadRequestException);
    });

    it('throws if an invalid password is provided', async () => {
        await expect(service.signin(email, wrongPassword))
            .rejects.toThrow(BadRequestException);
    });

    it('returns user if valid email and password are provided', async () => {
        const actual = await service.signin(email, password);
        expect(actual).toBeDefined();
    });

});


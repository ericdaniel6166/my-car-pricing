import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersService} from "./users.service";
import {promisify} from "util";
import {randomBytes, scrypt as _scrypt} from "crypto";


const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    private readonly pointSymbol = '.';

    constructor(private usersService: UsersService) {
    }

    async signup(email: string, password: string) {
        const user = await this.usersService.find(email);
        if (user) {
            throw new BadRequestException('Email is already existed');
        }
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const encryptedPassword = `${salt}${this.pointSymbol}${hash.toString('hex')}`;
        return await this.usersService.create(email, encryptedPassword);

    }


    async signin(email: string, password: string) {
        const user = await this.usersService.find(email);
        if (!user) {
            throw new BadRequestException('Wrong email or password');
        }
        const [salt, storedHash] = user.password.split(this.pointSymbol);
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (hash.toString('hex') !== storedHash) {
            throw new BadRequestException('Wrong email or password');
        }
        return user;
    }

}
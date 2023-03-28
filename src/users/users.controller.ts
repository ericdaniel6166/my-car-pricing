import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors
} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';
import {UsersService} from './users.service';
import {UpdateUserDto} from "./dtos/update-user.dto";
import {Serialize} from "../interceptors/serialize.interceptor";
import {UserDto} from "./dtos/user.dto";
import {AuthService} from "./auth.service";
import {CurrentUser} from "./decorators/current-user.decorator";
import {User} from "./user.entity";
import {CurrentUserInterceptor} from "./interceptors/current-user.interceptor";

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
      private usersService: UsersService,
      private authService: AuthService,
  ) {}

  // @Get('/colors/:color')
  // async setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }
  //
  // @Get('/colors')
  // async getColor(@Session() session: any) {
  //   return session.color;
  // }

  // @Get('/whoami')
  // async whoAmI(@Session() session: any){
  //   const user = await this.usersService.findOne(session.userId);
  //   if (!user){
  //     throw new NotFoundException('User not found');
  //   }
  //   return user;
  // }

  @Get('/whoami')
  async whoAmI(@CurrentUser() user: User){
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user){
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/')
  find(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    this.usersService.update(parseInt(id), body);
  }


}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { NotFoundException } from '@nestjs/common/exceptions';
// 1.
// import { SerializeInterceptor } from 'src/interceptors/serialize.iterceptor';
import { UserDto } from './dto/use.dto';
import { Serialize } from './../interceptors/serialize.iterceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.intercepoter';
import { User } from './user.entity';
import { AuthGuard } from './../guards/auth.guard';

@Controller('auth')
// 2.
@Serialize(UserDto)
//  [1]
// @UseInterceptors(CurrentUserInterceptor)
// 第二版本的修改在user.module.ts
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  // UseGuards 没有session.id这个接口不能被访问 403
  @UseGuards(AuthGuard)
  // 没有session.id这个接口会返回空值
  WhoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
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

  // 1.`
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // 2.
  // @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    console.log('id', id);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { NotFoundException } from '@nestjs/common/exceptions';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //  See if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the users password
    // Generate a salt (1111代表hex，16进制，即1字节有2个16进制字符串，这里将返回32个16进制字符串)
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together （返回前32个字节 Buffer类型）
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hased result and the salt together
    // Buffer不能直接和字符串合并
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.userService.create(email, result);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}

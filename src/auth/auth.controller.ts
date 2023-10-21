import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    const oldUser = await this.userService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.userService.createUser(dto);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('signin')
  async signin(@Body() { login, password }: AuthDto) {
    const { email } = await this.authService.validateUser(login, password);

    return this.authService.signin(email);
  }
}

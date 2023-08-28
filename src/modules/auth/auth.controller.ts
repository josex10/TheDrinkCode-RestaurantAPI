import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HandlerResponseService } from 'src/common/helpers';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private handlerResponseService: HandlerResponseService,
  ) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async create(@Body() login: LoginDto) {
    const successLogin = await this.authService.fnLogin(login);
    return this.handlerResponseService.handleSuccess(
      successLogin,
      HttpStatus.OK,
      AuthService.name,
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() register: RegisterDto) {
    const successResgister = await this.authService.fnRegister(register);
    return this.handlerResponseService.handleSuccess(
      successResgister,
      HttpStatus.CREATED,
      AuthService.name,
    );
  }

  @Get('renew')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async renew(@Request() req) {
    const successResgister = await this.authService.fnRefresh(req.user);
    return this.handlerResponseService.handleSuccess(
      successResgister,
      HttpStatus.CREATED,
      AuthService.name,
    );
  }
}

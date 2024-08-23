import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dtos/login-response.dto';
import { JwtAuthGuard } from 'src/guards/auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('sign-in')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dtos/login-response.dto';
import { JwtAuthGuard } from 'src/guards/auth-guard';
import { Response, Request } from 'express';

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.register(body);

    res.cookie('token', userData.refreshToken, {
      httpOnly: true,
      maxAge: body.rememberMe ? SEVEN_DAYS_IN_MS : TWO_HOURS_IN_MS,
    });

    res.cookie('rememberMe', body.rememberMe, {
      httpOnly: true,
      maxAge: body.rememberMe ? SEVEN_DAYS_IN_MS : TWO_HOURS_IN_MS,
    });

    return userData;
  }

  @Post('sign-in')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.login(body);

    res.cookie('token', userData.refreshToken, {
      httpOnly: true,
      maxAge: body.rememberMe ? SEVEN_DAYS_IN_MS : TWO_HOURS_IN_MS,
    });

    res.cookie('rememberMe', body.rememberMe, {
      httpOnly: true,
      maxAge: body.rememberMe ? SEVEN_DAYS_IN_MS : TWO_HOURS_IN_MS,
    });

    return userData;
  }

  @ApiBearerAuth('Refresh Token')
  @Get('refresh')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async refresh(@Req() req: Request) {
    return this.authService.refresh(req.cookies.token, req.cookies.rememberMe);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Refresh Token')
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}

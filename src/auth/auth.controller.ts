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
import { TokenExpirationTimeMs } from './enums/token-expiration-time.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.register(body);

    res.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: body.rememberMe
        ? TokenExpirationTimeMs.REFRESH_LONG
        : TokenExpirationTimeMs.REFRESH_SHORT,
    });

    res.cookie('rememberMe', body.rememberMe, {
      httpOnly: true,
      maxAge: body.rememberMe
        ? TokenExpirationTimeMs.REFRESH_LONG
        : TokenExpirationTimeMs.REFRESH_SHORT,
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

    res.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: body.rememberMe
        ? TokenExpirationTimeMs.REFRESH_LONG
        : TokenExpirationTimeMs.REFRESH_SHORT,
    });

    res.cookie('rememberMe', body.rememberMe, {
      httpOnly: true,
      maxAge: body.rememberMe
        ? TokenExpirationTimeMs.REFRESH_LONG
        : TokenExpirationTimeMs.REFRESH_SHORT,
    });

    return userData;
  }

  @ApiBearerAuth('Refresh Token')
  @Get('refresh')
  @ApiOkResponse({ type: () => LoginResponseDto })
  async refresh(@Req() req: Request) {
    return this.authService.refresh(
      req.cookies.refreshToken,
      req.cookies.rememberMe,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Refresh Token')
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}

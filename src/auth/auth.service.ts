import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { isNil, omit } from 'lodash';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from './entities/user.entity';
import { TokenExpirationTime } from './enums/token-expiration-time.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  public async register({ email, password, rememberMe }: CreateUserDto) {
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await this.createUser(email, hashedPassword);
    const payload = { email: newUser.email, sub: newUser.id };
    return {
      ...this.generateTokenPair(payload, rememberMe),
      ...omit(newUser, ['password']),
    };
  }

  public async login({ email, password, rememberMe }: LoginDto) {
    const user = await this.validateUser(email, password);

    if (isNil(user)) {
      throw new BadRequestException('Incorrect email or password');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      ...this.generateTokenPair(payload, rememberMe),
      ...omit(user, ['password']),
    };
  }

  private async createUser(email: string, hashedPassword: string) {
    return this.userRepository.save({ email, password: hashedPassword });
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.findUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return omit(user, ['password']);
    }
    return null;
  }

  public async refresh(token: string, rememberMe: boolean) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
        ignoreExpiration: false,
      });

      return this.generateTokenPair(payload, rememberMe);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private generateTokenPair(
    payload: { email: string; sub: number },
    rememberMe: boolean,
  ) {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: TokenExpirationTime.ACCESS,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: rememberMe
          ? TokenExpirationTime.REFRESH_LONG
          : TokenExpirationTime.REFRESH_SHORT,
      }),
    };
  }

  private async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}

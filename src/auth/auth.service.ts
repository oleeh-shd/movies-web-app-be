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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  public async register({ email, password }: CreateUserDto) {
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await this.createUser(email, hashedPassword);
    return {
      ...this.generateTokenPair(newUser),
      ...omit(newUser, ['password']),
    };
  }

  public async login({ email, password }: LoginDto) {
    const user = await this.validateUser(email, password);

    if (isNil(user)) {
      throw new BadRequestException('Incorrect email or password');
    }

    return {
      ...this.generateTokenPair(user),
      ...omit(user, ['password']),
    };
  }

  private async createUser(email: string, hashedPassword: string) {
    return this.userRepository.save({ email, password: hashedPassword });
  }

  private generateTokenPair({ email, id }: UserEntity) {
    const payload = { email, sub: id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return omit(user, ['password']);
    }
    return null;
  }

  public async refresh(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
        ignoreExpiration: false,
      });

      return {
        accessToken: this.jwtService.sign(omit(payload, ['iat', 'exp']), {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1h',
        }),
        refreshToken: this.jwtService.sign(omit(payload, ['iat', 'exp']), {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        }),
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}

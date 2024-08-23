import {
  BadRequestException,
  ConflictException,
  Injectable,
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

  public async register({ email, password }: CreateUserDto): Promise<any> {
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await this.createUser(email, hashedPassword);
    return {
      accessToken: this.generateToken(newUser),
      ...omit(newUser, ['password']),
    };
  }

  private async createUser(email: string, hashedPassword: string) {
    return this.userRepository.save({ email, password: hashedPassword });
  }

  private generateToken({ email, id }: UserEntity) {
    const payload = { email, sub: id };

    return this.jwtService.sign(payload);
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return omit(user, ['password']);
    }
    return null;
  }

  async login({ email, password }: LoginDto) {
    const user = await this.validateUser(email, password);

    if (isNil(user)) {
      throw new BadRequestException('Incorrect email or password');
    }

    return {
      accessToken: this.generateToken(user),
      ...omit(user, ['password']),
    };
  }

  private async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}

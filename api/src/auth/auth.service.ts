import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email: dto.email.toLowerCase(),
          password: await hash(dto.password, 12),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (hasCode(error, 'P2002'))
        throw new ConflictException(
          'An account with this email already exists',
        );
      throw error;
    }
    return { user, accessToken: await this.issueToken(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    return { user: safeUser, accessToken: await this.issueToken(safeUser) };
  }

  private issueToken(user: {
    id: string;
    email: string;
    role: 'PATRON' | 'LIBRARIAN';
  }) {
    return this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}

function hasCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

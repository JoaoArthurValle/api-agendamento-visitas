import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email já cadastrado.');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return this.signToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return this.signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  private signToken(user: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user };
  }
}

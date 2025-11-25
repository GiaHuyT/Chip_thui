import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcryptjs';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';

class RegisterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{9,12}$/)
  phone?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

class LoginDto {
  @IsString()
  identifier!: string; // email or phone

  @IsString()
  @MinLength(6)
  password!: string;
}

class ForgotDto {
  @ValidateIf((o: ForgotDto) => !o.phone)
  @IsEmail()
  email?: string;

  @ValidateIf((o: ForgotDto) => !o.email)
  @IsString()
  @Matches(/^\d{9,12}$/)
  phone?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const hasContact = !!(body.email || body.phone);
    if (!hasContact) {
      throw new BadRequestException('Email or phone is required');
    }
    const existingByEmail = body.email
      ? await this.prisma.findUserByEmail(body.email)
      : null;
    const existingByPhone = body.phone
      ? await this.prisma.findUserByPhone(body.phone)
      : null;
    const existing = existingByEmail ?? existingByPhone;
    if (existing) {
      throw new BadRequestException('User already exists');
    }
    const hash = await bcrypt.hash(body.password, 10);
    const user = await this.prisma.createUser({
      name: body.name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      passwordHash: hash,
    });
    return { message: 'Registration successful', user };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const id = body.identifier?.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
    const isPhone = !isEmail && /^\d{9,12}$/.test(id);
    if (!isEmail && !isPhone) {
      throw new BadRequestException('Invalid email or phone');
    }
    const user = isEmail
      ? await this.prisma.findUserByEmail(id)
      : await this.prisma.findUserByPhone(id);
    if (!user) return { error: 'User not found' };
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) return { error: 'Invalid credentials' };
    return {
      message: 'Login successful',
      user: { id: user.id, name: user.name },
    };
  }

  @Post('forgot')
  forgot(@Body() body: ForgotDto) {
    const dest = body.email ? 'email' : body.phone ? 'phone' : null;
    if (!dest) {
      throw new BadRequestException('Email or phone is required');
    }
    return { message: `OTP sent to your ${dest}` };
  }
}

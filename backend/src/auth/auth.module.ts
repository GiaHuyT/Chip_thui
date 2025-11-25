import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
})
export class AuthModule {}
